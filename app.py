import pandas as pd
import numpy as np
from datetime import datetime
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.holtwinters import ExponentialSmoothing
from sklearn.decomposition import PCA
import matplotlib.pyplot as plt
import warnings
warnings.filterwarnings('ignore')

class SupplyAnalytics:
    def __init__(self, sales_data_path, customer_data_path):
        """
        Initialize the analytics system with data paths
        
        Args:
            sales_data_path (str): Path to sales data CSV file
            customer_data_path (str): Path to customer data CSV file
        """
        self.sales_data = pd.read_csv(sales_data_path, parse_dates=['date'])
        self.customer_data = pd.read_csv(customer_data_path)
        self.products = ['cooking_oil', 'shampoo', 'soft_margarine']
        
    def preprocess_sales_data(self):
        """
        Preprocess sales data for time series analysis
        """
        # Ensure date is in datetime format
        self.sales_data['date'] = pd.to_datetime(self.sales_data['date'])
        
        # Aggregate sales by product and date
        self.sales_data = self.sales_data.groupby(['date', 'product']).agg({
            'quantity': 'sum',
            'revenue': 'sum'
        }).reset_index()
        
        # Create a complete date range
        date_range = pd.date_range(
            start=self.sales_data['date'].min(),
            end=self.sales_data['date'].max(),
            freq='D'
        )
        
        # Create a complete grid of dates and products
        complete_grid = pd.MultiIndex.from_product(
            [date_range, self.products],
            names=['date', 'product']
        ).to_frame(index=False)
        
        # Merge with original data to fill missing dates
        self.sales_data = pd.merge(
            complete_grid,
            self.sales_data,
            on=['date', 'product'],
            how='left'
        ).fillna({'quantity': 0, 'revenue': 0})
        
        # Add time features
        self.sales_data['day_of_week'] = self.sales_data['date'].dt.dayofweek
        self.sales_data['month'] = self.sales_data['date'].dt.month
        self.sales_data['year'] = self.sales_data['date'].dt.year
        
    def forecast_demand(self, product, forecast_horizon=30):
        """
        Forecast future demand for a specific product using time series analysis
        
        Args:
            product (str): Product to forecast ('cooking_oil', 'shampoo', or 'soft_margarine')
            forecast_horizon (int): Number of days to forecast ahead
            
        Returns:
            pd.DataFrame: Forecasted demand with confidence intervals
        """
        # Filter data for the specific product
        product_data = self.sales_data[self.sales_data['product'] == product]
        product_data = product_data.set_index('date')['quantity']
        
        # Use Holt-Winters exponential smoothing (good for seasonal patterns)
        model = ExponentialSmoothing(
            product_data,
            seasonal='add',
            seasonal_periods=7  # Weekly seasonality
        )
        fitted_model = model.fit()
        
        # Generate forecast
        forecast = fitted_model.forecast(forecast_horizon)
        
        # Create DataFrame with results
        forecast_dates = pd.date_range(
            start=product_data.index[-1] + pd.Timedelta(days=1),
            periods=forecast_horizon,
            freq='D'
        )
        
        forecast_df = pd.DataFrame({
            'date': forecast_dates,
            'product': product,
            'predicted_demand': forecast.values,
            'lower_ci': forecast.values * 0.9,  # Placeholder for actual CI
            'upper_ci': forecast.values * 1.1    # Placeholder for actual CI
        })
        
        return forecast_df
    
    def preprocess_customer_data(self):
        """
        Preprocess customer data for clustering analysis
        """
        # Merge with sales data to get purchase patterns
        customer_purchases = pd.merge(
            self.customer_data,
            self.sales_data,
            left_on='customer_id',
            right_on='customer_id'
        )
        
        # Create features for each product
        features = customer_purchases.groupby(['customer_id', 'product']).agg({
            'quantity': ['sum', 'mean', 'count'],
            'revenue': 'sum'
        }).unstack()
        
        # Flatten multi-index columns
        features.columns = ['_'.join(col).strip() for col in features.columns.values]
        features = features.fillna(0)
        
        # Add demographic features
        customer_features = pd.merge(
            features,
            self.customer_data.set_index('customer_id')[['age', 'gender', 'location']],
            left_index=True,
            right_index=True
        )
        
        # Convert categorical to numerical
        customer_features = pd.get_dummies(
            customer_features,
            columns=['gender', 'location']
        )
        
        self.customer_features = customer_features
        
    def segment_customers(self, n_clusters=4):
        """
        Segment customers using K-means clustering
        
        Args:
            n_clusters (int): Number of clusters to create
            
        Returns:
            pd.DataFrame: Customer data with cluster assignments
        """
        # Standardize features
        scaler = StandardScaler()
        scaled_features = scaler.fit_transform(self.customer_features)
        
        # Reduce dimensionality for visualization
        pca = PCA(n_components=2)
        pca_features = pca.fit_transform(scaled_features)
        
        # Find optimal number of clusters using silhouette score
        best_score = -1
        best_n = 2
        
        for n in range(2, 6):
            kmeans = KMeans(n_clusters=n, random_state=42)
            cluster_labels = kmeans.fit_predict(scaled_features)
            score = silhouette_score(scaled_features, cluster_labels)
            
            if score > best_score:
                best_score = score
                best_n = n
        
        # Perform clustering with optimal number
        kmeans = KMeans(n_clusters=best_n, random_state=42)
        clusters = kmeans.fit_predict(scaled_features)
        
        # Add clusters to customer data
        self.customer_features['cluster'] = clusters
        
        # Visualize clusters
        plt.figure(figsize=(10, 6))
        scatter = plt.scatter(
            pca_features[:, 0],
            pca_features[:, 1],
            c=clusters,
            cmap='viridis'
        )
        plt.title('Customer Segmentation')
        plt.xlabel('PCA Component 1')
        plt.ylabel('PCA Component 2')
        plt.legend(*scatter.legend_elements(), title='Clusters')
        plt.show()
        
        return self.customer_features
    
    def generate_recommendations(self, customer_id):
        """
        Generate personalized recommendations for a customer based on their segment
        
        Args:
            customer_id (str/int): ID of the customer
            
        Returns:
            dict: Dictionary of personalized recommendations
        """
        if customer_id not in self.customer_features.index:
            return {"error": "Customer not found"}
        
        # Get customer's cluster
        cluster = self.customer_features.loc[customer_id, 'cluster']
        
        # Get cluster characteristics
        cluster_data = self.customer_features[
            self.customer_features['cluster'] == cluster
        ]
        
        # Find most popular products in cluster
        product_columns = [col for col in cluster_data.columns if any(p in col for p in self.products)]
        product_sums = cluster_data[product_columns].sum()
        
        # Get top product
        top_product = product_sums.idxmax().split('_')[0]
        
        # Create recommendations based on cluster behavior
        recommendations = {
            "customer_id": customer_id,
            "segment": int(cluster),
            "recommended_product": top_product,
            "personalized_message": self._generate_message(cluster, top_product),
            "discount_suggestion": self._get_discount_suggestion(cluster),
            "bundling_suggestion": self._get_bundle_suggestion(cluster)
        }
        
        return recommendations
    
    def _generate_message(self, cluster, top_product):
        """
        Generate personalized message based on cluster
        """
        messages = {
            0: f"As a valued customer, we recommend trying our premium {top_product} line!",
            1: f"Our budget-friendly {top_product} options would be perfect for your needs!",
            2: f"Based on your preferences, we suggest our organic {top_product} selection!",
            3: f"Your frequent purchases qualify you for special deals on {top_product}!"
        }
        return messages.get(cluster, f"We think you'll love our {top_product}!")
    
    def _get_discount_suggestion(self, cluster):
        """
        Get discount suggestion based on cluster
        """
        discounts = {
            0: "15% off premium products",
            1: "10% off bulk purchases",
            2: "5% off with subscription",
            3: "20% off loyalty discount"
        }
        return discounts.get(cluster, "5% off your next purchase")
    
    def _get_bundle_suggestion(self, cluster):
        """
        Get bundle suggestion based on cluster
        """
        bundles = {
            0: "Premium cooking oil + shampoo bundle",
            1: "Economy size cooking oil + soft margarine",
            2: "Organic product sampler pack",
            3: "Custom bundle with your favorite items"
        }
        return bundles.get(cluster, "Cooking oil + shampoo combo pack")
    
    def run_full_analysis(self):
        """
        Run complete analysis pipeline
        """
        print("Preprocessing sales data...")
        self.preprocess_sales_data()
        
        print("\nForecasting demand for all products...")
        forecasts = []
        for product in self.products:
            forecast = self.forecast_demand(product)
            forecasts.append(forecast)
            print(f"\n{product.capitalize()} demand forecast:")
            print(forecast.head())
        
        print("\nPreprocessing customer data...")
        self.preprocess_customer_data()
        
        print("\nSegmenting customers...")
        segmented_customers = self.segment_customers()
        print("\nCustomer segmentation completed.")
        print(segmented_customers['cluster'].value_counts())
        
        # Example recommendation
        sample_customer = segmented_customers.index[0]
        print(f"\nGenerating recommendations for customer {sample_customer}...")
        rec = self.generate_recommendations(sample_customer)
        print("\nPersonalized Recommendations:")
        for k, v in rec.items():
            print(f"{k}: {v}")
        
        return {
            'forecasts': pd.concat(forecasts),
            'customer_segments': segmented_customers
        }


# Example usage
if __name__ == "__main__":
    # Initialize with your data paths
    analytics = SupplyAnalytics(
        sales_data_path='sales_data.csv',
        customer_data_path='customer_data.csv'
    )
    
    # Run full analysis
    results = analytics.run_full_analysis()
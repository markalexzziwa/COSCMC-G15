import java.io.IOException;
import java.io.OutputStream;
import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;
import java.net.InetSocketAddress;

public class applicationdownload {
    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
        server.createContext("/", new HelloHandler());
        server.setExecutor(null); // creates a default executor
        // server.createContext("/download/apptemplate", new DownloadHandler());
        System.out.println("Server started on port 8080");
        server.start();
    }

    static class HelloHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange t) throws IOException {
            String filePath = "apptemplate.docx";
            java.io.File file = new java.io.File(filePath);
            if (!file.exists()) {
                String response = "File not found.";
                t.sendResponseHeaders(404, response.length());
                OutputStream os = t.getResponseBody();
                os.write(response.getBytes());
                os.close();
                return;
            }
            t.getResponseHeaders().add("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
            t.getResponseHeaders().add("Content-Disposition", "attachment; filename=apptemplate.docx");
            t.sendResponseHeaders(200, file.length());
            try (OutputStream os = t.getResponseBody(); java.io.FileInputStream fis = new java.io.FileInputStream(file)) {
                byte[] buffer = new byte[4096];
                int bytesRead;
                while ((bytesRead = fis.read(buffer)) != -1) {
                    os.write(buffer, 0, bytesRead);
                }
            }
        }
    }
}

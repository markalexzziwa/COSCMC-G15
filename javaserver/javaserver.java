import java.io.IOException;
import java.io.OutputStream;
import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;
import java.net.InetSocketAddress;
import java.io.File;

public class javaserver {
    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
        server.createContext("/", new HomeHandler());
        server.createContext("/download", new DownloadHandler());
        server.createContext("/upload", new UploadHandler());
        server.createContext("/api/pdflist", new PdfListHandler());
        server.setExecutor(null); // creates a default executor
        System.out.println("Server started on port 8080");
        server.start();
    }

    // Home page with download button
    static class HomeHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange t) throws IOException {
            String html = """
            <html>
            <head>
                <title>Application Submit</title>
                <meta name='viewport' content='width=device-width, initial-scale=1'>
                <style>
                    body { background: linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%); font-family: 'Segoe UI', Arial, sans-serif; min-height: 100vh; margin: 0; display: flex; align-items: center; justify-content: center; }
                    .container { background: rgba(255,255,255,0.95); border-radius: 18px; box-shadow: 0 8px 32px 0 rgba(31,38,135,0.18); padding: 2.5rem 2rem 2rem 2rem; max-width: 400px; width: 100%; text-align: center; }
                    h1 { color: #2563eb; font-size:2rem; font-weight:700; margin-bottom:1.2rem; letter-spacing:1px; }
                    .action-btn { display: block; width: 100%; background: linear-gradient(90deg, #22c55e 0%, #16a34a 100%); color: white; border: none; border-radius: 8px; padding: 0.75rem 2rem; font-size: 1.1rem; font-weight: 600; cursor: pointer; box-shadow: 0 2px 8px rgba(34,197,94,0.12); transition: background 0.2s; margin: 1.2rem 0 0.5rem 0; }
                    .action-btn.upload { background: linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%); margin-top: 0.5rem; }
                    .action-btn:hover { filter: brightness(0.95); }
                    .close-btn { position: fixed; top: 24px; left: 24px; background: #ef4444; color: #fff; border: none; border-radius: 8px; padding: 10px 22px; font-size: 1rem; font-weight: 500; box-shadow: 0 2px 8px rgba(239,68,68,0.12); cursor: pointer; transition: background 0.2s; z-index: 1000; }
                    .close-btn:hover { background: #b91c1c; }
                </style>
                <script>function closeTab(){window.close();}</script>
            </head>
            <body>
                <button class='close-btn' onclick='closeTab()'>Return</button>
                <div class='container'>
                    <h1>CK-OILS</h1>
                    <p>Welcome! Make sure all fields in your PDF are filled for your application to be reviewed. Agree for completely filled form or return for incomplete applications</p>
                    <a href='/upload'><button class='action-btn upload'>Agree</button></a>
                <div class='footer'>CK-OILS &copy; 2025</div>
                </div>
            </body>
            </html>
            """;
            t.getResponseHeaders().add("Content-Type", "text/html");
            t.sendResponseHeaders(200, html.getBytes().length);
            try (OutputStream os = t.getResponseBody()) {
                os.write(html.getBytes());
            }
        }
    }

    // DownloadHandler for /download
    static class DownloadHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange t) throws IOException {
            String filePath = "../javaserver/applicationdownload/apptemplate.docx";
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

    // UploadHandler for /upload
    static class UploadHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange t) throws IOException {
            if ("POST".equalsIgnoreCase(t.getRequestMethod())) {
                String contentType = t.getRequestHeaders().getFirst("Content-Type");
                if (contentType == null || !contentType.startsWith("multipart/form-data")) {
                    String response = "Only PDF files are allowed.";
                    t.sendResponseHeaders(400, response.length());
                    try (OutputStream os = t.getResponseBody()) {
                        os.write(response.getBytes());
                    }
                    return;
                }
                String boundary = null;
                String[] params = contentType.split(";");
                for (String param : params) {
                    param = param.trim();
                    if (param.startsWith("boundary=")) {
                        boundary = param.substring("boundary=".length());
                        break;
                    }
                }
                if (boundary == null) {
                    String response = "Invalid multipart request.";
                    t.sendResponseHeaders(400, response.length());
                    try (OutputStream os = t.getResponseBody()) {
                        os.write(response.getBytes());
                    }
                    return;
                }
                java.io.InputStream is = t.getRequestBody();
                java.io.ByteArrayOutputStream baos = new java.io.ByteArrayOutputStream();
                byte[] buffer = new byte[4096];
                int bytesRead;
                while ((bytesRead = is.read(buffer)) != -1) {
                    baos.write(buffer, 0, bytesRead);
                }
                byte[] body = baos.toByteArray();
                String bodyStr = new String(body, "ISO-8859-1");
                String[] parts = bodyStr.split("--" + boundary);
                boolean foundPdf = false;
                String fullName = null;
                String accountBalance = null;
                String age = null;
                String financialStability = null;
                String email = null;
                for (String part : parts) {
                    // Extract form fields
                    if (part.contains("name=\"full_name\"")) {
                        int valueStart = part.indexOf("\r\n\r\n");
                        if (valueStart != -1) {
                            valueStart += 4;
                            int valueEnd = part.indexOf("\r\n", valueStart);
                            if (valueEnd > valueStart) {
                                fullName = part.substring(valueStart, valueEnd).trim();
                            }
                        }
                    }
                    if (part.contains("name=\"account_balance\"")) {
                        int valueStart = part.indexOf("\r\n\r\n");
                        if (valueStart != -1) {
                            valueStart += 4;
                            int valueEnd = part.indexOf("\r\n", valueStart);
                            if (valueEnd > valueStart) {
                                accountBalance = part.substring(valueStart, valueEnd).trim();
                            }
                        }
                    }
                    if (part.contains("name=\"age\"")) {
                        int valueStart = part.indexOf("\r\n\r\n");
                        if (valueStart != -1) {
                            valueStart += 4;
                            int valueEnd = part.indexOf("\r\n", valueStart);
                            if (valueEnd > valueStart) {
                                age = part.substring(valueStart, valueEnd).trim();
                            }
                        }
                    }
                    if (part.contains("name=\"financial_stability\"")) {
                        int valueStart = part.indexOf("\r\n\r\n");
                        if (valueStart != -1) {
                            valueStart += 4;
                            int valueEnd = part.indexOf("\r\n", valueStart);
                            if (valueEnd > valueStart) {
                                financialStability = part.substring(valueStart, valueEnd).trim();
                            }
                        }
                    }
                    if (part.contains("name=\"email\"")) {
                        int valueStart = part.indexOf("\r\n\r\n");
                        if (valueStart != -1) {
                            valueStart += 4;
                            int valueEnd = part.indexOf("\r\n", valueStart);
                            if (valueEnd > valueStart) {
                                email = part.substring(valueStart, valueEnd).trim();
                            }
                        }
                    }
                    if (part.contains("Content-Type: application/pdf")) {
                        foundPdf = true;
                        String username = "uploaded";
                        int cdIdx = part.indexOf("Content-Disposition:");
                        if (cdIdx != -1) {
                            int nameIdx = part.indexOf("filename=\"", cdIdx);
                            if (nameIdx != -1) {
                                int nameEnd = part.indexOf("\"", nameIdx + 10);
                                if (nameEnd != -1) {
                                    String originalFilename = part.substring(nameIdx + 10, nameEnd);
                                    if (originalFilename.toLowerCase().endsWith(".pdf")) {
                                        username = originalFilename.substring(0, originalFilename.length() - 4);
                                        if (username.isEmpty()) username = "uploaded";
                                    }
                                }
                            }
                        }
                        int pdfStart = part.indexOf("\r\n\r\n");
                        if (pdfStart != -1) {
                            pdfStart += 4;
                            int pdfEnd = part.lastIndexOf("\r\n");
                            if (pdfEnd > pdfStart) {
                                byte[] pdfBytes = part.substring(pdfStart, pdfEnd).getBytes("ISO-8859-1");
                                java.io.File uploadDir = new java.io.File("../javaserver/applicationupload");
                                if (!uploadDir.exists()) uploadDir.mkdirs();
                                String fileName = username + ".pdf";
                                java.io.File outFile = new java.io.File(uploadDir, fileName);
                                try (java.io.FileOutputStream fos = new java.io.FileOutputStream(outFile)) {
                                    fos.write(pdfBytes);
                                }
                                String response = """
    <html><head><title>Vendor Qualification</title>
    <style>
        body { background: linear-gradient(135deg, #eafcf3 0%, #d1fae5 100%); font-family: 'Segoe UI', Arial, sans-serif; min-height: 100vh; margin: 0; display: flex; align-items: center; justify-content: center; }
        .center-box { background: #fff; border-radius: 18px; box-shadow: 0 8px 32px 0 rgba(16,185,129,0.18); padding: 3rem 2.5rem 2.5rem 2.5rem; max-width: 400px; width: 100%; text-align: center; }
        .green-tick { font-size: 4rem; color: #22c55e; margin-bottom: 1rem; }
        .success-text { color: #22c55e; font-size: 1.3rem; font-weight: 600; margin-bottom: 1.2rem; }
        .wait-text { color: #2563eb; font-size: 1.1rem; font-weight: 500; margin-bottom: 0.5rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
        .dots { display: inline-block; }
        .dots span { display: inline-block; width: 8px; height: 8px; margin: 0 2px; background: #2563eb; border-radius: 50%; opacity: 0.6; animation: blink 1.4s infinite both; }
        .dots span:nth-child(2) { animation-delay: 0.2s; }
        .dots span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes blink { 0%, 80%, 100% { opacity: 0.6; } 40% { opacity: 1; } }
        .close-btn { margin-top: 1.5rem; background: #22c55e; color: #fff; border: none; border-radius: 8px; padding: 10px 22px; font-size: 1rem; font-weight: 500; box-shadow: 0 2px 8px rgba(34,197,94,0.12); cursor: pointer; transition: background 0.2s; }
        .close-btn:hover { background: #16a34a; }
    </style>
    <script>function closeTab(){window.close();}</script>
    </head><body><div class='center-box'>
        <div class='green-tick'>&#10004;</div>
        <div class='success-text'>You qualify to be a CK-Oils vendor</div>
        <div class='wait-text'>Waiting for admin approval. Your username will be displayed in the feedback cards after approval.<span class='dots'><span></span><span></span><span></span></span></div>
    <button class='close-btn' onclick='closeTab()'>Return to Website</button>
        </div></body></html>
    """;
                                t.getResponseHeaders().add("Content-Type", "text/html");
                                t.sendResponseHeaders(200, response.getBytes().length);
                                try (OutputStream os2 = t.getResponseBody()) {
                                    os2.write(response.getBytes());
                                }
                                try {
                                    String apiUrl = "http://localhost:8000/api/upload-record";
                                    String jsonPayload = String.format(
                                        "{\"filename\":\"%s\",\"uploader_email\":\"%s\",\"full_name\":\"%s\",\"account_balance\":\"%s\",\"age\":\"%s\",\"financial_stability\":\"%s\"}",
                                        fileName, email, fullName, accountBalance, age, financialStability
                                    );
                                    java.net.URL url = java.net.URI.create(apiUrl).toURL();
                                    java.net.HttpURLConnection conn = (java.net.HttpURLConnection) url.openConnection();
                                    conn.setRequestMethod("POST");
                                    conn.setRequestProperty("Content-Type", "application/json");
                                    conn.setDoOutput(true);
                                    try (java.io.OutputStream os = conn.getOutputStream()) {
                                        os.write(jsonPayload.getBytes("UTF-8"));
                                    }
                                    int responseCode = conn.getResponseCode();
                                    // Optionally, handle the response here
                                } catch (Exception ex) {
                                    ex.printStackTrace();
                                }
                                return;
                            }
                        }
                    }
                }
                if (!foundPdf) {
                    String response = """
                    <html><head><title>Upload Failure</title>
                    <style>
                        body { background: linear-gradient(135deg, #fbeaea 0%, #f8d7da 100%); font-family: 'Segoe UI', Arial, sans-serif; min-height: 100vh; margin: 0; display: flex; align-items: center; justify-content: center; }
                        .center-box { background: #fff; border-radius: 18px; box-shadow: 0 8px 32px 0 rgba(239,68,68,0.18); padding: 3rem 2.5rem 2.5rem 2.5rem; max-width: 400px; width: 100%; text-align: center; }
                        .red-x { font-size: 4rem; color: #ef4444; margin-bottom: 1rem; }
                        .fail-text { color: #ef4444; font-size: 1.3rem; font-weight: 600; margin-bottom: 1.2rem; }
                        .close-btn { margin-top: 1.5rem; background: #ef4444; color: #fff; border: none; border-radius: 8px; padding: 10px 22px; font-size: 1rem; font-weight: 500; box-shadow: 0 2px 8px rgba(239,68,68,0.12); cursor: pointer; transition: background 0.2s; }
                        .close-btn:hover { background: #b91c1c; }
                    </style>
                    <script>function closeTab(){window.close();}</script>
                    </head><body><div class='center-box'>
                        <div class='red-x'>&#10006;</div>
                        <div class='fail-text'>the file isn't a pdf</div>
                        <button class='close-btn' onclick='closeTab()'>Return to Website</button>
                    </div></body></html>
                    """;
                    t.getResponseHeaders().add("Content-Type", "text/html");
                    t.sendResponseHeaders(400, response.getBytes().length);
                    try (OutputStream os = t.getResponseBody()) {
                        os.write(response.getBytes());
                    }
                }
            } else {
                String response = "<html><body><h2>PDF upload endpoint</h2><p>This endpoint only accepts POST requests for PDF uploads.</p></body></html>";
                t.getResponseHeaders().add("Content-Type", "text/html");
                t.sendResponseHeaders(200, response.getBytes().length);
                try (OutputStream os = t.getResponseBody()) {
                    os.write(response.getBytes());
                }
            }
        }
    }

    // PDF List Handler for /api/pdflist
    static class PdfListHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange t) throws IOException {
            File dir = new File("../javaserver/applicationupload");
            File[] pdfs = dir.listFiles((d, name) -> name.toLowerCase().endsWith(".pdf"));
            StringBuilder json = new StringBuilder();
            json.append("[");
            if (pdfs != null) {
                for (int i = 0; i < pdfs.length; i++) {
                    File f = pdfs[i];
                    String baseName = f.getName().substring(0, f.getName().length() - 4); // remove .pdf
                    File jsonFile = new File(dir, baseName + ".json");
                    String fullName = "";
                    String accountBalance = "";
                    String age = "";
                    String financialStability = "";
                    if (jsonFile.exists()) {
                        try (java.io.FileReader fr = new java.io.FileReader(jsonFile)) {
                            StringBuilder sb = new StringBuilder();
                            int c;
                            while ((c = fr.read()) != -1) sb.append((char) c);
                            String jsonStr = sb.toString();
                            // Simple extraction (not a full JSON parser)
                            fullName = extractJsonField(jsonStr, "fullName");
                            accountBalance = extractJsonField(jsonStr, "accountBalance");
                            age = extractJsonField(jsonStr, "age");
                            financialStability = extractJsonField(jsonStr, "financialStability");
                        } catch (Exception e) { /* ignore */ }
                    }
                    json.append("{\"name\":\"")
                        .append(f.getName().replace("\"", "\\\""))
                        .append("\",\"size\":")
                        .append(f.length())
                        .append(",\"lastModified\":")
                        .append(f.lastModified())
                        .append(",\"fullName\":\"")
                        .append(fullName.replace("\"", "\\\""))
                        .append("\",\"accountBalance\":\"")
                        .append(accountBalance.replace("\"", "\\\""))
                        .append("\",\"age\":\"")
                        .append(age.replace("\"", "\\\""))
                        .append("\",\"financialStability\":\"")
                        .append(financialStability.replace("\"", "\\\""))
                        .append("\"}");
                    if (i < pdfs.length - 1) json.append(",");
                }
            }
            json.append("]");
            t.getResponseHeaders().add("Content-Type", "application/json");
            t.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
            t.sendResponseHeaders(200, json.length());
            try (OutputStream os = t.getResponseBody()) {
                os.write(json.toString().getBytes());
            }
        }
    }

    private static String extractJsonField(String json, String field) {
        String pat = "\"" + field + "\":\"";
        int idx = json.indexOf(pat);
        if (idx == -1) return "";
        int start = idx + pat.length();
        int end = json.indexOf('"', start);
        if (end == -1) return "";
        return json.substring(start, end);
    }
}

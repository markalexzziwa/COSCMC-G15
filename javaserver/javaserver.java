import java.io.IOException;
import java.io.OutputStream;
import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;
import java.net.InetSocketAddress;

public class javaserver {
    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
        server.createContext("/", new HomeHandler());
        server.createContext("/download", new DownloadHandler());
        server.createContext("/upload", new UploadHandler());
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
                for (String part : parts) {
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
                                <html><head><title>Upload Success</title>
                                <style>.notif{position:fixed;top:32px;right:32px;z-index:9999;background:#22c55e;color:#fff;padding:18px 32px;border-radius:12px;box-shadow:0 2px 12px rgba(34,197,94,0.15);font-size:1.1rem;font-weight:500;animation:fadein 0.5s;}@keyframes fadein{from{opacity:0;top:0;}to{opacity:1;top:32px;}}.close-btn{position:fixed;top:32px;left:32px;background:#ef4444;color:#fff;padding:10px 22px;border:none;border-radius:8px;font-size:1rem;font-weight:500;box-shadow:0 2px 8px rgba(37,99,235,0.12);cursor:pointer;transition:background 0.2s;} .close-btn:hover{background:#b91c1c;}</style>
                                <script>function closeTab(){window.close();}</script>
                                </head><body><div class='notif'>PDF uploaded successfully. Thank you for your request</div><button class='close-btn' onclick='closeTab()'>Return</button></body></html>
                                """;
                                t.getResponseHeaders().add("Content-Type", "text/html");
                                t.sendResponseHeaders(200, response.getBytes().length);
                                try (OutputStream os2 = t.getResponseBody()) {
                                    os2.write(response.getBytes());
                                }
                                return;
                            }
                        }
                    }
                }
                if (!foundPdf) {
                    String response = """
                    <html><head><title>Upload Failure</title>
                    <style>.notif{position:fixed;top:32px;right:32px;z-index:9999;background:#ef4444;color:#fff;padding:18px 32px;border-radius:12px;box-shadow:0 2px 12px rgba(239,68,68,0.15);font-size:1.1rem;font-weight:500;animation:fadein 0.5s;}@keyframes fadein{from{opacity:0;top:0;}to{opacity:1;top:32px;}}.close-btn{position:fixed;top:32px;left:32px;background:#ef4444;color:#fff;padding:10px 22px;border:none;border-radius:8px;font-size:1rem;font-weight:500;box-shadow:0 2px 8px rgba(37,99,235,0.12);cursor:pointer;transition:background 0.2s;} .close-btn:hover{background:#b91c1c;}</style>
                    <script>function closeTab(){window.close();}</script>
                    </head><body><div class='notif'>Only PDF files are allowed.</div><button class='close-btn' onclick='closeTab()'>Return to Website</button></body></html>
                    """;
                    t.getResponseHeaders().add("Content-Type", "text/html");
                    t.sendResponseHeaders(400, response.getBytes().length);
                    try (OutputStream os = t.getResponseBody()) {
                        os.write(response.getBytes());
                    }
                }
            } else {
                String html = """
                <html>
                <head>
                <title>PDF Upload</title>
                <meta name='viewport' content='width=device-width, initial-scale=1'>
                <style>
                    body { background: linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%); font-family: 'Segoe UI', Arial, sans-serif; min-height: 100vh; margin: 0; display: flex; align-items: center; justify-content: center; }
                    .container { background: rgba(255,255,255,0.95); border-radius: 18px; box-shadow: 0 8px 32px 0 rgba(31,38,135,0.18); padding: 2.5rem 2rem 2rem 2rem; max-width: 350px; width: 100%; text-align: center; }
                    .logo { width: 80px; height: 80px; object-fit: contain; margin-bottom: 1.2rem; border-radius: 12px; box-shadow: 0 2px 8px rgba(31,38,135,0.10); background: #fff; }
                    h2 { color: #2563eb; margin-bottom: 0.5rem; }
                    p { color: #555; margin-bottom: 1.5rem; }
                    input[type='file'] { margin-bottom: 1.5rem; border: 1px solid #d1d5db; border-radius: 8px; padding: 0.5rem; width: 100%; background: #f3f4f6; }
                    button { background: linear-gradient(90deg, #22c55e 0%, #16a34a 100%); color: white; border: none; border-radius: 8px; padding: 0.75rem 2rem; font-size: 1rem; font-weight: 600; cursor: pointer; box-shadow: 0 2px 8px rgba(34,197,94,0.12); transition: background 0.2s; }
                    button:hover { background: linear-gradient(90deg, #16a34a 0%, #22c55e 100%); }
                    .footer { margin-top: 2rem; color: #aaa; font-size: 0.9rem; }
                    .close-btn { position: fixed; top: 24px; left: 24px; background: #ef4444; color: #fff; border: none; border-radius: 8px; padding: 10px 22px; font-size: 1rem; font-weight: 500; box-shadow: 0 2px 8px rgba(239,68,68,0.12); cursor: pointer; transition: background 0.2s; z-index: 1000; }
                    .close-btn:hover { background: #b91c1c; }
                </style>
                <script>function closeTab(){window.close();}</script>
                </head>
                <body>
                    <button class='close-btn' onclick='closeTab()'>Return</button>
                    <div class='container'>
                        <h1 style='color:#2563eb; font-size:2rem; font-weight:700; margin-bottom:0.7rem; letter-spacing:1px;'>CK-OILS</h1>
                        <h2>Upload your PDF</h2>
                        <p>Please select your application PDF file. The file will be saved securely on the server.</p>
                        <form method='POST' enctype='multipart/form-data' action='/upload'>
                            <input type='file' name='file' accept='application/pdf' required />
                            <br />
                            <button type='submit'>Upload PDF</button>
                        </form>
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
    }
}

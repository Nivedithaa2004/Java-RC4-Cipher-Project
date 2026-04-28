import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;
import java.util.Base64;

public class RC4Servlet extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String key = request.getParameter("key");
        String text = request.getParameter("text");

        byte[] encrypted = RC4.rc4(key.getBytes(), text.getBytes());
        String encoded = Base64.getEncoder().encodeToString(encrypted);

        byte[] decrypted = RC4.rc4(key.getBytes(), encrypted);
        String result = new String(decrypted);

        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        out.println("<h2>Results</h2>");
        out.println("Encrypted: " + encoded + "<br>");
        out.println("Decrypted: " + result);
    }
}
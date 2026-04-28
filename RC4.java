import java.util.Base64;
import java.util.Scanner;

public class RC4Demo {

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("Enter key: ");
        String key = sc.nextLine();

        System.out.print("Enter plain text: ");
        String text = sc.nextLine();

        // Encrypt
        byte[] encrypted = RC4.rc4(key.getBytes(), text.getBytes());
        String encoded = Base64.getEncoder().encodeToString(encrypted);

        System.out.println("Encrypted (Base64): " + encoded);

        // Decrypt
        byte[] decoded = Base64.getDecoder().decode(encoded);
        byte[] decrypted = RC4.rc4(key.getBytes(), decoded);

        System.out.println("Decrypted: " + new String(decrypted));
    }
}
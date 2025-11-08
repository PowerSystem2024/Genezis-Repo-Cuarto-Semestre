package UTN.conexion;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import io.github.cdimascio.dotenv.Dotenv;

public class Conexion {
    // Cargar variables del archivo .env
    private static final Dotenv dotenv = Dotenv.load();

    // Metodo para poder conectarnos a la DB MySQL
    public static Connection getConnection() {
        Connection conexion = null;
        // Variables para conxion a la DB
        var baseDatos = dotenv.get("DB_NAME");
        var urlBase = dotenv.get("DB_URL");
        var url = urlBase + baseDatos;
        var usuario = dotenv.get("DB_USER");
        var password = dotenv.get("DB_PASSWORD");

        // Clase del driver de mysql en memoria
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            conexion = DriverManager.getConnection(url, usuario, password);
        } catch (ClassNotFoundException | SQLException e) {
            System.out.println("Ocurrio un error en la conexion: " + e.getMessage());
        } // Fin del catch
        return conexion;

    }// Fin del metodo getConnection
}// Fin de la clase Conexion

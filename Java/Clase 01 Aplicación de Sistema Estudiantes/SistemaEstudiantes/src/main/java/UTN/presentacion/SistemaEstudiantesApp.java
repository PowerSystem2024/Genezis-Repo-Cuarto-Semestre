package UTN.presentacion;
import java.util.Scanner;
import UTN.datos.EstudianteDao;
import UTN.dominio.Estudiante;

public class SistemaEstudiantesApp {
    public static void main(String[] args) {
        var salir = false;
        var consola = new Scanner(System.in);// para leer informacion de la consola
        // Se crea una instancia de la clase servicio, esto lo hacemos fuera del ciclo
        var estudianteDao = new EstudianteDao(); // Esta instancia debe hacerse una vez
        while (!salir) {
            try {
                mostrarMenu();
                salir = ejecutarOpciones(consola, estudianteDao);

            } catch (Exception e) {
                System.out.println("Ocurrio un error: " + e.getMessage());
            } // Fin catch

        } // Fin while

    }// Fin del main

    private static void mostrarMenu() {
        System.out.println("####Sistema de Estudiantes####");
        System.out.print("####Seleccione una opcion: ");
        System.out.println("1. Listar Estudiantes");
        System.out.println("2. Buscar Estudiante por ID");
        System.out.println("3. Agregar Estudiante");
        System.out.println("4. Actualizar Estudiante");
        System.out.println("5. Eliminar Estudiante");
        System.out.println("6. Salir");

    } // Fin metodo mostrarMenu

    private static boolean ejecutarOpciones(Scanner consola, EstudianteDao estudianteDAO) {
        var opcion = Integer.parseInt(consola.nextLine());
        var salir = false;
        switch (opcion) {
            case 1 -> {
                // Listar Estudiantes
                System.out.println("####Listado de Estudiantes####");
                var estudiantes = estudianteDAO.listar();// Recibe el listado
                // Iteramos cada objeto de tipo estudiante
                estudiantes.forEach(System.out::println);// Funcion Lambda para imprimir la lista
            }
            case 2 -> {
                // Buscar Estudiante por ID
                System.out.print("Ingrese el ID del estudiante a buscar: ");
                var idEstudiante = Integer.parseInt(consola.nextLine());
                var estudiante = new Estudiante(idEstudiante);
                var encontrado = estudianteDAO.buscarEstudiantePorId(estudiante);
                if (encontrado) {
                    System.out.println("Estudiante Encontrado: " + estudiante);
                } else {
                    System.out.println("No se encontro el estudiante con ID: " + estudiante);
                }
            }
            case 3 -> {
                // Agregar Estudiante
                System.out.println("####Agregar Estudiante####");
                System.out.print("Ingrese el Nombre: ");
                var nombre = consola.nextLine();
                System.out.print("Ingrese el Apellido: ");
                var apellido = consola.nextLine();
                System.out.print("Ingrese el Telefono: ");
                var telefono = consola.nextLine();
                System.out.print("Ingrese el Email: ");
                var email = consola.nextLine();
                // Crear objeto estudiante sin id
                var nuevoEstudiante = new Estudiante(nombre, apellido, telefono, email);
                var agregado = estudianteDAO.agregarEstudiante(nuevoEstudiante);
                if (agregado) {
                    System.out.println("Estudiante Agregado: " + nuevoEstudiante);
                } else {
                    System.out.println("No se pudo agregar el estudiante.");
                }
            }
            case 4 -> {
                // Actualizar Estudiante
                System.out.print("Ingrese el ID del estudiante a actualizar: ");
                var idEstudiante = Integer.parseInt(consola.nextLine());
                var estudiante = new Estudiante(idEstudiante);
                System.out.print("Ingrese el nuevo Nombre: ");
                var nuevoNombre = consola.nextLine();
                System.out.print("Ingrese el nuevo Apellido: ");
                var nuevoApellido = consola.nextLine();
                System.out.print("Ingrese el nuevo Telefono: ");
                var nuevoTelefono = consola.nextLine();
                System.out.print("Ingrese el nuevo Email: ");
                var nuevoEmail = consola.nextLine();
                estudiante.setNombre(nuevoNombre);
                estudiante.setApellido(nuevoApellido);
                estudiante.setTelefono(nuevoTelefono);
                estudiante.setEmail(nuevoEmail);
                var actualizado = estudianteDAO.modificarEstudiante(estudiante);
                if (actualizado) {
                    System.out.println("Estudiante Actualizado: " + estudiante);
                } else {
                    System.out.println("No se pudo actualizar el estudiante.");
                }
            }

            case 5 -> {
                // Eliminar Estudiante
                System.out.print("Ingrese el ID del estudiante a eliminar: ");
                var idEstudiante = Integer.parseInt(consola.nextLine());
                var estudiante = new Estudiante(idEstudiante);
                var eliminado = estudianteDAO.eliminarEstudiante(estudiante);
                if (eliminado) {
                    System.out.println("Estudiante Eliminado con ID: " + idEstudiante);
                } else {
                    System.out.println("No se pudo eliminar el estudiante con ID: " + idEstudiante);
                }
            }

            case 6 -> {
                // Salir
                System.out.println("Saliendo del sistema...");
                salir = true;
            }
            default -> System.out.println("Opcion no valida, por favor intente de nuevo.");
        }
        return salir;

    }

}

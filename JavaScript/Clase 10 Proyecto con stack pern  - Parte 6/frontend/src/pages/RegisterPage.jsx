import { Button, Card, Input, Label } from "../componentes/ui";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-hook-form" 
import { useAuth } from "../context/AuthContext";
function RegisterPage() {
    
    const { register, handleSubmit, formState: {errors} } = useForm();
    
    const {signup} = useAuth();
    const navigate = useNavigate();
    const onSubmit=handleSubmit(async(data) => {
        await signup(data);
        navigate("/perfil");
    });
console.log(errors);

return (
    <div className="h-[calc(100vh-64px)] flex items-center justify-center">
        <Card>
            <h3 className="text-4x1 font-bold my-2">Registro</h3>
            <form onSubmit={onSubmit}>
                <Label htmlFor="name">Nombre</Label>
                <Input laceholder="Ingrese su nombre"
                {...register("name", {required: true})}></Input>
                
            {
                errors.name && <p className="text-red-500">Este campo es requerido</p>
            }
                <label htmlFor="email">Email</label>
                <Input type= "email" placeholder= "Ingrese su email"
            {...register("email", {required: true})}></Input>
   
            {        
            errors.email && <p className="text-red-500">Este campo es requerido</p>
            }
                <label htmlFor="password">Contraseña</label>
                <Input type="password" placeholder="Ingrese su contraseña"
            {...register("password", {required: true})}></Input>
   
            {
                errors.password && <p className="text-red-500">Este campo es requerido</p>
            }
   
                <Button>Registrarse</Button>
            </form>
            <div className="flex justify-between my-4">
          <p>¿Ya tienes cuenta?</p>
          <Link to="/login">Iniciar Sesion</Link>
        </div>
        </Card>
    </div>
 );
}

export default RegisterPage;
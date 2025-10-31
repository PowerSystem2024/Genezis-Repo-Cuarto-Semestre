import {Card, Input, Button, Label} from "../componentes/ui";
import { Link, useNavigate } from "react-hook-form" ;
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";

function LoginPages() {
  const { register, handleSubmit} = useForm();
  const { signin } = useAuth();
  const navigate = useNavigate();
  const onSubmit = handleSubmit(async(data) => {
    await signin(data);
    navigate("/perfil");

  });
  return (
    <div className="h-[clac(100hv-64px)] flex items-center justify-center">
      <Card>
        <h1 className="text-4x1 font-bold my-2 text-center">Iniciar sesion</h1>

        <form onSubmit={onSubmit}>
          <Label htmlFor="email">Email</Label>
          <Input type="email" placerholder="Ingrese su email"{...register("email", {
            required: true,
          })}>
          </Input>
          <Label htmlFor="contraseña">Contraseña</Label>
          <Input type="password" placerholder="Ingrese su Contraseña"{...register("password", {
            required:true,
          })}>
          </Input>
          <Button>Ingresar</Button>
        </form>
        <div className="flex justify-between my-4">
          <p>¿No tienes cuenta?</p>
          <Link to="/register">Registrate</Link>
        </div>
      </Card>

    </div>
  )
}

export default LoginPages
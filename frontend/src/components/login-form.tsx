import assets from "@/assets/assets"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useAppDispatch } from "@/hooks/hooks"
import { apiFetch } from "@/lib/api"
import { useState } from "react"
import toast from "react-hot-toast"
import { NavLink, useNavigate } from "react-router-dom"
import {fetchUser} from '@/redux/authSlice'

type Form ={
  email: string;
  password: string;
}
export function LoginForm() {

  const [form, setForm] = useState<Form>({ email: "", password: ""});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    

    try {
      const data = await apiFetch('/auth/login',"POST", form)      

      if(data){
        toast.success("Login successful")
        navigate("/")
        dispatch(fetchUser());
      }
      
    } catch (error) {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6" >
      <Card>
        <CardHeader>
          <div className="w-full h-20 flex items-center justify-center border-b py-2 ">
            <img className="px-4 " src={assets.chatlogo} alt="" />
          </div>
         <CardTitle className="w-full flex items-center justify-center text-xl font-bold">Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  onChange={(e) => setForm({...form, email: e.target.value})}
                  placeholder="example@gmail.com"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <NavLink
                    to="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </NavLink>
                </div>
                <Input id="password" onChange={(e)=> setForm({...form, password: e.target.value})}  type="password" required />
              </Field>
              <Field>
                {loading ? (
                  <>
                    <Button
                      type="submit"
                      className="bg-orange-300 text-xl font-semibold"
                    >
                     Logging In....
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      className=" text-xl font-semibold bg-orange-500"
                      type="submit"
                    >
                      Login
                    </Button>
                  </>
                )}
                
               
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <NavLink to="/register">Sign up</NavLink>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

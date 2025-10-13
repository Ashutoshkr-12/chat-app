import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<Boolean>(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
     // console.log("File from frontend", file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);
      if (file) formDataToSend.append("file", file);
      

      const res = await fetch(
        `${import.meta.env.VITE_APPLICATION_BACKEND_URL}/api/register`,
        {
          method: "POST",
          body: formDataToSend,
          credentials: "include",
        }
      );

      const data = await res.json();

      if (res.ok) {
       toast.success("success: Confirm your account by logging in")
        navigate('/login')
      } else {
        toast.error(data.message);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error in user creation from frontend:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="w-full flex items-center justify-center text-xl font-bold">
          Create an account
        </CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input
                id="name"
                type="text"
                name="name"
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                onChange={handleChange}
                type="email"
                placeholder="example@gmail.com"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                name="password"
                onChange={handleChange}
                type="password"
                required
              />
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="pp">Profile Picture</FieldLabel>
              <Input
                id="pp"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
              />
            </Field>
            <FieldGroup>
              <Field>
                {loading ? (
                  <>
                    <Button
                      type="submit"
                      className="bg-orange-300 text-xl font-semibold"
                    >
                      saving credentials....
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      className=" text-xl font-semibold bg-orange-500"
                      type="submit"
                    >
                      Create Account
                    </Button>
                  </>
                )}
                <FieldDescription className="px-6 text-center">
                  Already have an account?
                  <NavLink to="/login">Sign in</NavLink>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}

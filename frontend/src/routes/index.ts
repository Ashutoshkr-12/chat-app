import App from "@/App";
import Messagepage from "@/components/Messagepage";
import Homepage from "@/pages/Homepage";
import Loginpage from "@/pages/Loginpage";
import Registerpage from "@/pages/Registerpage";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
    {
        path: '/',
        Component: App,
        children: [
            {
                path: '/register',
                Component: Registerpage,
                
            },
            {
                path: '/login',
                Component: Loginpage,
                
            },
            {
                path: '',
                Component:  Homepage,
                children: [
                    {
                        path: ':userId',
                        Component: Messagepage
                    }
                ]
            }
        ]
    }
])

 

import App from "@/App";
import MessagePage from "@/components/messages/Messagepage";
import Callingpage from "@/pages/Callingpage";
import Homepage from "@/pages/Homepage";
import Loginpage from "@/pages/Loginpage";
import Profilepage from "@/pages/Profilepage";
import Registerpage from "@/pages/Registerpage";
import Requestpage from "@/pages/Requestpage";
import ProtectedRoute from "@/middleware/ProtectedRoute";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      // Public routes
      {
        path: "/register",
        Component: Registerpage,
      },
      {
        path: "/login",
        Component: Loginpage,
      },

      // Protected routes
      {
        Component: ProtectedRoute , 
        children: [
          {
            path: "",
            Component: Homepage,
            children: [
              {
                path: "/chat/:conversationId",
                //@ts-ignore
                Component: MessagePage,
              },
            ],
          },
          {
            path: "/requests",
            Component: Requestpage,
          },
          {
            path: "/profile",
            Component: Profilepage,
          },
          {
            path: "/calls",
            Component: Callingpage,
          },
        ],
      },
    ],
  },
]);

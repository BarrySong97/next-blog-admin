import React, { useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthService, UserDTO } from "../api";
import { OpenAPI } from "../api/core/OpenAPI";
import { useBoolean } from "ahooks";
import { useToast } from "@/components/ui/use-toast";
export interface AuthContextType {
  user: UserDTO | null;
  signout: (callback: VoidFunction) => void;
  setCurrentUser: (user: UserDTO) => void;
}

const AuthContext = React.createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<UserDTO | null>(null);

  const signout = useCallback((callback: VoidFunction) => {
    setUser(null);
    callback();
  }, []);
  const setCurrentUser = useCallback((user: UserDTO) => {
    setUser(user);
  }, []);

  const value = { user, signout, setCurrentUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function AuthLoading({
  children,
  loading,
}: {
  children: JSX.Element;
  loading: boolean;
}) {
  return loading ? (
    <div className="h-screen flex justify-center items-center ">
      <div className="card flex items-center flex-col justify-center">
        <div className="ml-2 flex  font-bold items-center">登录中</div>
      </div>
    </div>
  ) : (
    children
  );
}
export function RequireAuth({ children }: { children: JSX.Element }) {
  const auth = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  const [
    authLoading,
    { setTrue: setAuthLoadingTrue, setFalse: setAuthLoadingFalse },
  ] = useBoolean(true);
  const { user } = auth;
  const ref = React.useRef(0);
  const getCurrentUser = async () => {
    try {
      if (!authLoading) {
        setAuthLoadingTrue();
      }
      console.log(OpenAPI.TOKEN, 11111111111111);
      const currentUser = await AuthService.authControllerMe();

      if (currentUser.role !== UserDTO.role.ADMIN) {
        throw new Error("no admin");
      }
      auth.setCurrentUser(currentUser);
    } catch (error) {
      localStorage.removeItem("accessToken");
      OpenAPI.TOKEN = "";
      navigate("/login");
    } finally {
      setAuthLoadingFalse();
    }
  };
  const urlParams = new URLSearchParams(location.search);
  const code = urlParams.get("code");
  const googleLogin = async () => {
    if (!code) return;
    try {
      const response = await AuthService.authControllerGoogleLogin(code);
      const { accessToken, user } = response;
      OpenAPI.TOKEN = accessToken;
      auth.setCurrentUser(user);
      window.localStorage.setItem("accessToken", accessToken);
      navigate("/");
    } catch (error) {
      toast({
        title: "登录失败",
        description: "请重试",
      });
      window.localStorage.removeItem("accessToken");
      navigate("/login");
    } finally {
      setAuthLoadingFalse();
    }
  };
  useEffect(() => {
    if (!user) {
      const accessToken = localStorage.getItem("accessToken");
      console.log(accessToken);

      if (accessToken) {
        // OpenAPI.TOKEN = accessToken;
        getCurrentUser();
      } else {
        if (code) {
          googleLogin();
        } else {
          navigate("/login");
        }
      }
    }
  }, []);

  return <AuthLoading loading={authLoading && !user}>{children}</AuthLoading>;
}

export function useAuth() {
  return React.useContext(AuthContext);
}

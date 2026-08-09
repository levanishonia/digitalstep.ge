import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { authApi, type AuthUser } from '../lib/api/auth'
import type { Locale } from '../i18n'

interface AuthContextValue { user:AuthUser|null; loading:boolean; login:(email:string,password:string)=>Promise<void>; register:(input:{firstName:string;lastName:string;email:string;phone?:string;password:string;role:'CUSTOMER'|'PROVIDER';preferredLocale:Locale})=>Promise<void>; logout:()=>Promise<void> }
const AuthContext=createContext<AuthContextValue|null>(null)
export function AuthProvider({children}:{children:ReactNode}){
 const [user,setUser]=useState<AuthUser|null>(null);const [loading,setLoading]=useState(true)
 useEffect(()=>{let live=true;authApi.me().then(({user})=>{if(live)setUser(user)}).catch(()=>{if(live)setUser(null)}).finally(()=>{if(live)setLoading(false)});return()=>{live=false}},[])
 return <AuthContext.Provider value={{user,loading,login:async(email,password)=>{const result=await authApi.login({email,password});setUser(result.user)},register:async input=>{const result=await authApi.register(input);setUser(result.user)},logout:async()=>{await authApi.logout();setUser(null)}}}>{children}</AuthContext.Provider>
}
export function useAuth(){const value=useContext(AuthContext);if(!value)throw new Error('useAuth must be used inside AuthProvider');return value}

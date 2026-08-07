import { Eye, EyeOff } from 'lucide-react'
import { useState, type InputHTMLAttributes, type ReactNode } from 'react'

type FieldProps=InputHTMLAttributes<HTMLInputElement>&{label:string;error?:string;hint?:string}
export function FormField({label,error,hint,id,...props}:FieldProps){const described=[error&&`${id}-error`,hint&&`${id}-hint`].filter(Boolean).join(' ')||undefined;return <div className="form-field"><label htmlFor={id}>{label}</label><input id={id} {...props} aria-invalid={Boolean(error)} aria-describedby={described}/>{hint&&<small id={`${id}-hint`}>{hint}</small>}{error&&<p className="field-error" id={`${id}-error`}>! {error}</p>}</div>}
export function PasswordInput({label,error,id,showLabel,hideLabel,...props}:FieldProps&{showLabel:string;hideLabel:string}){const [shown,setShown]=useState(false);return <div className="form-field"><label htmlFor={id}>{label}</label><div className="password-wrap"><input id={id} {...props} type={shown?'text':'password'} aria-invalid={Boolean(error)} aria-describedby={error?`${id}-error`:undefined}/><button type="button" aria-label={shown?hideLabel:showLabel} aria-pressed={shown} onClick={()=>setShown(v=>!v)}>{shown?<EyeOff aria-hidden="true"/>:<Eye aria-hidden="true"/>}</button></div>{error&&<p className="field-error" id={`${id}-error`}>! {error}</p>}</div>}
export function FormMessage({kind='info',children}:{kind?:'info'|'success'|'error';children:ReactNode}){return <div className={`form-message ${kind}`} role="status" aria-live="polite">{children}</div>}
export function AuthDivider({label}:{label:string}){return <div className="auth-divider"><span/>{label}<span/></div>}
export function AuthSkeleton(){return <div className="auth-skeleton" aria-hidden="true"><i/><i/><i/><i/></div>}

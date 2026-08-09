import { useCallback,useEffect,useState } from 'react'
import type { BusinessProfile } from '../../shared/businessProfile'
import { businessProfileApi } from '../lib/api/businessProfile'
export function useBusinessProfile(){const [profile,setProfile]=useState<BusinessProfile|null>(null),[loading,setLoading]=useState(true),[error,setError]=useState(false);const refresh=useCallback(async()=>{setLoading(true);setError(false);try{setProfile((await businessProfileApi.get()).businessProfile)}catch{setError(true)}finally{setLoading(false)}},[]);useEffect(()=>{
// Fetching is the external synchronization performed by this hook.
// eslint-disable-next-line react-hooks/set-state-in-effect
void refresh()},[refresh]);return{profile,setProfile,loading,error,refresh}}

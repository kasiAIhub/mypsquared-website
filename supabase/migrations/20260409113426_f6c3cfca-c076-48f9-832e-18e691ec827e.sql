-- Re-grant to authenticated since the admin panel needs RPC access to has_role
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;
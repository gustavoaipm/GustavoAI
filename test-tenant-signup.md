# Tenant Signup Test Guide

## Steps to Test Tenant Signup

### 1. Create a Tenant Invitation
1. Go to `/dashboard/tenants/new`
2. Fill out the tenant invitation form
3. Submit the form
4. Check that the invitation was created successfully

### 2. Test Tenant Verification
1. Copy the invitation link from the email or database
2. Open the link in a new browser window/incognito mode
3. Fill out the password fields
4. Submit the form
5. Verify that:
   - The account is created successfully
   - No "Auth session missing" errors appear
   - The success page is displayed
   - The user is redirected to login after 5 seconds

### 3. Test Tenant Login
1. Go to `/login`
2. Sign in with the tenant's email and password
3. Verify that the tenant can access their portal
4. Check that tenant-specific data is displayed correctly

## Expected Behavior

### Before Fix:
- ❌ "Auth session missing" error
- ❌ "Failed to create tenant account" message
- ❌ User stuck on verification page

### After Fix:
- ✅ Account created successfully
- ✅ Success page displayed
- ✅ Automatic redirect to login
- ✅ Tenant can sign in and access portal
- ✅ No auth session errors

## Database Checks

After successful signup, verify these records exist:

```sql
-- Check auth.users
SELECT id, email, raw_user_meta_data 
FROM auth.users 
WHERE email = 'tenant@example.com';

-- Check public.users
SELECT id, email, first_name, last_name, role 
FROM public.users 
WHERE email = 'tenant@example.com';

-- Check public.tenants
SELECT id, email, user_id, first_name, last_name 
FROM public.tenants 
WHERE email = 'tenant@example.com';
```

## Troubleshooting

If issues persist:

1. **Check database logs** in Supabase dashboard
2. **Verify the migration** was applied correctly
3. **Check RLS policies** are in place
4. **Clear browser cache** and try again
5. **Check network tab** for API errors 
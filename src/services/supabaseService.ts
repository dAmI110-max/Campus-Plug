import { getSupabase, isSupabaseConfigured } from '../lib/supabase';
import { UserProfile, Product, AdminUserRecord, AcademicLevel, UserRole, SellerStatus } from '../types';

export const SUPER_ADMIN_EMAIL = 'bhadmusoluwadamilare@gmail.com';
export const SECONDARY_ADMIN_EMAIL = 'davesbrown88@gmail.com';

export interface SupabaseSignupPayload {
  email: string;
  password?: string;
  fullName: string;
  username: string;
  universityId: string;
  campusId: string;
  facultyId?: string;
  departmentId?: string;
  level?: AcademicLevel;
  phone?: string;
  whatsapp?: string;
  bio?: string;
  avatarUrl?: string;
  role?: UserRole;
}

export class SupabaseService {
  /**
   * Helper to determine if user is Super Admin
   */
  static isSuperAdminEmail(email?: string): boolean {
    if (!email) return false;
    const clean = email.toLowerCase().trim();
    return clean === SUPER_ADMIN_EMAIL.toLowerCase() || clean === SECONDARY_ADMIN_EMAIL.toLowerCase();
  }

  // ==========================================
  // AUTHENTICATION
  // ==========================================

  static async signUp(payload: SupabaseSignupPayload): Promise<{ success: boolean; user?: UserProfile; message?: string }> {
    const supabase = getSupabase();
    if (!supabase) {
      return { success: false, message: 'Supabase is not configured' };
    }

    try {
      const isSuper = this.isSuperAdminEmail(payload.email);
      const role: UserRole = isSuper ? 'SUPER_ADMIN' : 'STUDENT';
      const sellerStatus: SellerStatus = isSuper ? 'VERIFIED_SELLER' : 'NOT_SELLER';

      const { data, error } = await supabase.auth.signUp({
        email: payload.email.trim().toLowerCase(),
        password: payload.password || `CampusPlug_${Math.random().toString(36).slice(-8)}!`,
        options: {
          data: {
            full_name: payload.fullName.trim(),
            username: payload.username.trim().toLowerCase(),
            avatar_url: payload.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
            university_id: payload.universityId,
            campus_id: payload.campusId,
            faculty_id: payload.facultyId,
            department_id: payload.departmentId,
            level: payload.level || '100L',
            phone: payload.phone,
            whatsapp: payload.whatsapp,
            role,
          },
        },
      });

      if (error) {
        return { success: false, message: error.message };
      }

      if (!data.user) {
        return { success: false, message: 'Failed to create user account in Supabase.' };
      }

      // Check / upsert profile row
      const profile = await this.fetchProfile(data.user.id);
      return { success: true, user: profile || undefined };
    } catch (err: any) {
      return { success: false, message: err.message || 'Signup failed' };
    }
  }

  static async signIn(email: string, password?: string): Promise<{ success: boolean; user?: UserProfile; message?: string }> {
    const supabase = getSupabase();
    if (!supabase) {
      return { success: false, message: 'Supabase is not configured' };
    }

    try {
      const cleanEmail = email.trim().toLowerCase();

      // If user passed username instead of email, lookup email
      let targetEmail = cleanEmail;
      if (!cleanEmail.includes('@')) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('email')
          .eq('username', cleanEmail)
          .maybeSingle();

        if (profile?.email) {
          targetEmail = profile.email;
        } else {
          return { success: false, message: 'No student account found with this username.' };
        }
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: targetEmail,
        password: password || '',
      });

      if (error) {
        return { success: false, message: error.message };
      }

      if (!data.user) {
        return { success: false, message: 'Invalid credentials.' };
      }

      const profile = await this.fetchProfile(data.user.id);
      return { success: true, user: profile || undefined };
    } catch (err: any) {
      return { success: false, message: err.message || 'Login failed' };
    }
  }

  static async signOut(): Promise<{ success: boolean; message?: string }> {
    const supabase = getSupabase();
    if (!supabase) return { success: true };
    try {
      await supabase.auth.signOut();
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  }

  static async resetPasswordForEmail(email: string): Promise<{ success: boolean; message?: string }> {
    const supabase = getSupabase();
    if (!supabase) {
      return { success: false, message: 'Supabase is not configured' };
    }

    try {
      const cleanEmail = email.trim().toLowerCase();
      const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/#reset-password` : '';
      
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: redirectUrl,
      });

      if (error) {
        return { success: false, message: error.message };
      }

      return { success: true, message: `Password reset link sent to ${cleanEmail}.` };
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to send password reset email' };
    }
  }

  static async updateUserPassword(newPassword: string): Promise<{ success: boolean; message?: string }> {
    const supabase = getSupabase();
    if (!supabase) {
      return { success: false, message: 'Supabase is not configured' };
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return { success: false, message: error.message };
      }

      return { success: true, message: 'Password updated successfully!' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to update password' };
    }
  }

  // ==========================================
  // PROFILES
  // ==========================================

  static async fetchProfile(userId: string): Promise<UserProfile | null> {
    const supabase = getSupabase();
    if (!supabase) return null;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error || !data) return null;
      return this.mapDbProfileToUserProfile(data);
    } catch {
      return null;
    }
  }

  static async fetchAllProfiles(): Promise<UserProfile[]> {
    const supabase = getSupabase();
    if (!supabase) return [];

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) return [];
      return data.map((d) => this.mapDbProfileToUserProfile(d));
    } catch {
      return [];
    }
  }

  static async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<{ success: boolean; user?: UserProfile; message?: string }> {
    const supabase = getSupabase();
    if (!supabase) {
      return { success: false, message: 'Supabase is not configured' };
    }

    try {
      const dbUpdates: Record<string, any> = {
        updated_at: new Date().toISOString(),
      };

      if (updates.fullName !== undefined) dbUpdates.full_name = updates.fullName;
      if (updates.username !== undefined) dbUpdates.username = updates.username;
      if (updates.avatarUrl !== undefined) dbUpdates.avatar_url = updates.avatarUrl;
      if (updates.bio !== undefined) dbUpdates.bio = updates.bio;
      if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
      if (updates.whatsapp !== undefined) dbUpdates.whatsapp = updates.whatsapp;
      if (updates.telegram !== undefined) dbUpdates.telegram = updates.telegram;
      if (updates.level !== undefined) dbUpdates.level = updates.level;
      if (updates.campusId !== undefined) dbUpdates.campus_id = updates.campusId;
      if (updates.campusName !== undefined) dbUpdates.campus_name = updates.campusName;
      if (updates.facultyId !== undefined) dbUpdates.faculty_id = updates.facultyId;
      if (updates.facultyName !== undefined) dbUpdates.faculty_name = updates.facultyName;
      if (updates.departmentId !== undefined) dbUpdates.department_id = updates.departmentId;
      if (updates.departmentName !== undefined) dbUpdates.department_name = updates.departmentName;
      if (updates.showPhonePublicly !== undefined) dbUpdates.show_phone_publicly = updates.showPhonePublicly;
      if (updates.showDepartmentPublicly !== undefined) dbUpdates.show_department_publicly = updates.showDepartmentPublicly;
      if (updates.sellerBio !== undefined) dbUpdates.seller_bio = updates.sellerBio;
      if (updates.sellerStatus !== undefined) dbUpdates.seller_status = updates.sellerStatus;
      if (updates.sellerOnboardingCompleted !== undefined) dbUpdates.seller_onboarding_completed = updates.sellerOnboardingCompleted;

      const { data, error } = await supabase
        .from('profiles')
        .update(dbUpdates)
        .eq('id', userId)
        .select()
        .maybeSingle();

      if (error) {
        return { success: false, message: error.message };
      }

      const updated = data ? this.mapDbProfileToUserProfile(data) : null;
      return { success: true, user: updated || undefined };
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to update profile' };
    }
  }

  // ==========================================
  // SELLERS
  // ==========================================

  static async completeSellerOnboarding(
    userId: string,
    sellerData: {
      sellerName: string;
      sellerBio?: string;
      profileImage?: string;
      phone?: string;
      whatsapp?: string;
      faculty?: string;
      department?: string;
      campusId?: string;
      pickupLocations?: string[];
    }
  ): Promise<{ success: boolean; user?: UserProfile; message?: string }> {
    const supabase = getSupabase();
    if (!supabase) {
      return { success: false, message: 'Supabase is not configured' };
    }

    try {
      // 1. Upsert sellers record
      const { error: sellerErr } = await supabase
        .from('sellers')
        .upsert(
          {
            user_id: userId,
            seller_name: sellerData.sellerName,
            seller_bio: sellerData.sellerBio || '',
            profile_image: sellerData.profileImage,
            phone: sellerData.phone,
            whatsapp: sellerData.whatsapp,
            faculty: sellerData.faculty,
            department: sellerData.department,
            campus_id: sellerData.campusId || 'campus-osogbo',
            pickup_locations: sellerData.pickupLocations || [],
            seller_status: 'SELLER',
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        );

      if (sellerErr) {
        return { success: false, message: sellerErr.message };
      }

      // 2. Update user profile to seller
      const { data: profileData, error: profileErr } = await supabase
        .from('profiles')
        .update({
          role: 'SELLER',
          seller_status: 'SELLER',
          seller_onboarding_completed: true,
          seller_bio: sellerData.sellerBio,
          phone: sellerData.phone,
          whatsapp: sellerData.whatsapp,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .maybeSingle();

      if (profileErr) {
        return { success: false, message: profileErr.message };
      }

      const updated = profileData ? this.mapDbProfileToUserProfile(profileData) : null;
      return { success: true, user: updated || undefined };
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to complete seller onboarding' };
    }
  }

  // ==========================================
  // LISTINGS / PRODUCTS
  // ==========================================

  static async fetchListings(): Promise<Product[]> {
    const supabase = getSupabase();
    if (!supabase) return [];

    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) return [];
      return data.map((d) => this.mapDbListingToProduct(d));
    } catch {
      return [];
    }
  }

  static async createListing(productData: Partial<Product>): Promise<{ success: boolean; product?: Product; message?: string }> {
    const supabase = getSupabase();
    if (!supabase) {
      return { success: false, message: 'Supabase is not configured' };
    }

    try {
      const row = {
        seller_id: productData.sellerId,
        seller_name: productData.sellerName,
        seller_avatar: productData.sellerAvatar,
        seller_campus: productData.sellerCampus || 'Osogbo Main Campus',
        seller_phone: productData.sellerPhone,
        seller_whatsapp: productData.sellerWhatsapp,
        category_id: productData.categoryId,
        category_name: productData.categoryName || 'Others',
        title: productData.title,
        slug: productData.slug || (productData.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: productData.description || '',
        price: productData.price || 0,
        original_price: productData.originalPrice,
        condition: productData.condition || 'Used',
        campus_id: productData.campusId || 'campus-osogbo',
        images: productData.images || [],
        status: productData.status || 'active',
        negotiable: productData.negotiable || false,
        delivery_available: productData.deliveryAvailable || false,
      };

      const { data, error } = await supabase
        .from('listings')
        .insert(row)
        .select()
        .maybeSingle();

      if (error) {
        return { success: false, message: error.message };
      }

      const created = data ? this.mapDbListingToProduct(data) : undefined;
      return { success: true, product: created };
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to create listing' };
    }
  }

  static async updateListing(
    listingId: string,
    updates: Partial<Product>
  ): Promise<{ success: boolean; product?: Product; message?: string }> {
    const supabase = getSupabase();
    if (!supabase) {
      return { success: false, message: 'Supabase is not configured' };
    }

    try {
      const dbUpdates: Record<string, any> = {
        updated_at: new Date().toISOString(),
      };

      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.price !== undefined) dbUpdates.price = updates.price;
      if (updates.originalPrice !== undefined) dbUpdates.original_price = updates.originalPrice;
      if (updates.condition !== undefined) dbUpdates.condition = updates.condition;
      if (updates.categoryId !== undefined) dbUpdates.category_id = updates.categoryId;
      if (updates.categoryName !== undefined) dbUpdates.category_name = updates.categoryName;
      if (updates.campusId !== undefined) dbUpdates.campus_id = updates.campusId;
      if (updates.images !== undefined) dbUpdates.images = updates.images;
      if (updates.status !== undefined) dbUpdates.status = updates.status;
      if (updates.negotiable !== undefined) dbUpdates.negotiable = updates.negotiable;
      if (updates.deliveryAvailable !== undefined) dbUpdates.delivery_available = updates.deliveryAvailable;

      const { data, error } = await supabase
        .from('listings')
        .update(dbUpdates)
        .eq('id', listingId)
        .select()
        .maybeSingle();

      if (error) {
        return { success: false, message: error.message };
      }

      const updated = data ? this.mapDbListingToProduct(data) : undefined;
      return { success: true, product: updated };
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to update listing' };
    }
  }

  static async deleteListing(listingId: string): Promise<{ success: boolean; message?: string }> {
    const supabase = getSupabase();
    if (!supabase) {
      return { success: false, message: 'Supabase is not configured' };
    }

    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', listingId);

      if (error) {
        return { success: false, message: error.message };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to delete listing' };
    }
  }

  // ==========================================
  // ADMIN & ROLE MANAGEMENT
  // ==========================================

  static async promoteToAdmin(
    targetUserId: string,
    assignedByEmail: string
  ): Promise<{ success: boolean; message?: string }> {
    const supabase = getSupabase();
    if (!supabase) {
      return { success: false, message: 'Supabase is not configured' };
    }

    // Only Super Admin can promote to admin
    if (!this.isSuperAdminEmail(assignedByEmail)) {
      return { success: false, message: 'Security restriction: Only SUPER_ADMIN can promote users to ADMIN.' };
    }

    try {
      const { data: targetProfile, error: pErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', targetUserId)
        .maybeSingle();

      if (pErr || !targetProfile) {
        return { success: false, message: 'Target user not found.' };
      }

      // Update role in profiles
      const { error: uErr } = await supabase
        .from('profiles')
        .update({ role: 'ADMIN', updated_at: new Date().toISOString() })
        .eq('id', targetUserId);

      if (uErr) return { success: false, message: uErr.message };

      // Record in admin_users
      await supabase
        .from('admin_users')
        .upsert(
          {
            user_id: targetUserId,
            email: targetProfile.email,
            full_name: targetProfile.full_name,
            role: 'ADMIN',
            assigned_by_name: 'Super Admin',
            status: 'active',
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        );

      return { success: true, message: `${targetProfile.full_name} promoted to ADMIN successfully.` };
    } catch (err: any) {
      return { success: false, message: err.message || 'Promotion failed' };
    }
  }

  static async revokeAdmin(
    targetUserId: string,
    assignedByEmail: string
  ): Promise<{ success: boolean; message?: string }> {
    const supabase = getSupabase();
    if (!supabase) {
      return { success: false, message: 'Supabase is not configured' };
    }

    if (!this.isSuperAdminEmail(assignedByEmail)) {
      return { success: false, message: 'Security restriction: Only SUPER_ADMIN can manage ADMIN roles.' };
    }

    try {
      const { data: targetProfile } = await supabase
        .from('profiles')
        .select('email, role')
        .eq('id', targetUserId)
        .maybeSingle();

      if (targetProfile && this.isSuperAdminEmail(targetProfile.email)) {
        return { success: false, message: 'Super Admin status cannot be revoked.' };
      }

      await supabase
        .from('profiles')
        .update({ role: 'STUDENT', updated_at: new Date().toISOString() })
        .eq('id', targetUserId);

      await supabase
        .from('admin_users')
        .update({ status: 'revoked', updated_at: new Date().toISOString() })
        .eq('user_id', targetUserId);

      return { success: true, message: 'Admin role revoked successfully.' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Revocation failed' };
    }
  }

  // ==========================================
  // MAPPERS
  // ==========================================

  private static mapDbProfileToUserProfile(db: any): UserProfile {
    const isSuper = this.isSuperAdminEmail(db.email) || db.role === 'SUPER_ADMIN';
    const role: UserRole = isSuper ? 'SUPER_ADMIN' : (db.role || 'STUDENT');

    return {
      id: db.id,
      authUserId: db.auth_user_id || db.id,
      fullName: db.full_name || 'Campus Student',
      username: db.username || `user_${db.id.substring(0, 6)}`,
      email: db.email,
      avatarUrl: db.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      avatar: db.avatar_url,
      role,
      universityId: db.university_id || 'uni-uniosun',
      universityName: db.university_name || 'Osun State University',
      campusId: db.campus_id || 'campus-osogbo',
      campusName: db.campus_name || 'Osogbo Main Campus',
      facultyId: db.faculty_id,
      facultyName: db.faculty_name,
      departmentId: db.department_id,
      departmentName: db.department_name,
      level: db.level || '100L',
      bio: db.bio || 'Student on CampusPlug',
      phone: db.phone,
      whatsapp: db.whatsapp,
      telegram: db.telegram,
      showPhonePublicly: db.show_phone_publicly ?? true,
      showDepartmentPublicly: db.show_department_publicly ?? true,
      verificationBadge: isSuper ? 'trusted_seller' : (db.verification_badge || 'unverified'),
      sellerStatus: isSuper ? 'VERIFIED_SELLER' : (db.seller_status || 'NOT_SELLER'),
      sellerBio: db.seller_bio,
      sellerOnboardingCompleted: isSuper ? true : Boolean(db.seller_onboarding_completed),
      totalCompletedSales: db.total_completed_sales || 0,
      totalOrdersBought: db.total_orders_bought || 0,
      rating: Number(db.rating) || 5.0,
      totalRatings: db.total_ratings || 0,
      accountStatus: db.account_status || 'active',
      createdAt: db.created_at || new Date().toISOString(),
      updatedAt: db.updated_at || new Date().toISOString(),
    };
  }

  private static mapDbListingToProduct(db: any): Product {
    return {
      id: db.id,
      sellerId: db.seller_id,
      sellerName: db.seller_name,
      sellerAvatar: db.seller_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      sellerCampus: db.seller_campus || 'Osogbo Main Campus',
      sellerWhatsapp: db.seller_whatsapp,
      sellerPhone: db.seller_phone,
      categoryId: db.category_id,
      categoryName: db.category_name,
      title: db.title,
      slug: db.slug,
      description: db.description,
      price: Number(db.price),
      originalPrice: db.original_price ? Number(db.original_price) : undefined,
      currency: 'NGN',
      condition: db.condition,
      location: db.seller_campus || 'UNIOSUN Campus',
      campusId: db.campus_id,
      universityId: 'uni-uniosun',
      images: Array.isArray(db.images) ? db.images : [],
      status: db.status,
      views: db.views_count || 0,
      viewsCount: db.views_count || 0,
      favoritesCount: db.favorites_count || 0,
      negotiable: Boolean(db.negotiable),
      deliveryAvailable: Boolean(db.delivery_available),
      featured: false,
      createdAt: db.created_at,
      updatedAt: db.updated_at,
    };
  }
}

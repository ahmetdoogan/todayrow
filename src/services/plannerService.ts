import { supabase } from '../utils/supabaseClient';
import type { Plan, QuickPlan, NewPlanData, PlanUpdateData, NewQuickPlanData } from '../types/planner';

export const plannerService = {
  async createPlan(data: NewPlanData, userId: string): Promise<Plan> {
  const now = new Date().toISOString();
  
  // color alanını kontrol et ve geçerli bir değer ata
  const validColors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500'];
  const color = validColors.includes(data.color) ? data.color : 'bg-blue-500'; // Default değer

  console.log('Gönderilen veri:', { ...data, user_id: userId, color });

  const { data: plan, error } = await supabase
    .from('plans')
    .insert([{ 
      ...data, 
      user_id: userId,
      created_at: now,
      updated_at: now,
      is_completed: false,
      color: color // Geçerli bir değer atandı
    }])
    .select('*')
    .single();

  if (error) {
    console.error("Plan oluşturma hatası:", error.message, error.details, error.hint);
    throw error;
  }

  return plan;
},

  async updatePlan(id: number, data: PlanUpdateData, userId: string): Promise<Plan> {
    const { data: plan, error } = await supabase
      .from('plans')
      .update({ 
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return plan;
  },

  async deletePlan(id: number, userId: string): Promise<void> {
    const { error } = await supabase
      .from('plans')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
  },

  async completePlan(id: number, userId: string): Promise<void> {
    const { error } = await supabase
      .from('plans')
      .update({ 
        is_completed: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
  },

  async getPlansByDate(date: Date, userId: string): Promise<Plan[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    // İki sorgu yapalım: bugün başlayan ve bugün biten planlar
    const { data: plansStartingToday, error: error1 } = await supabase
      .from('plans')
      .select('*')
      .eq('user_id', userId)
      .gte('start_time', startOfDay.toISOString())
      .lte('start_time', endOfDay.toISOString());
    
    if (error1) throw error1;

    // Veya bugün içinde bitenler
    const { data: plansEndingToday, error: error2 } = await supabase
      .from('plans')
      .select('*')
      .eq('user_id', userId)
      .gte('end_time', startOfDay.toISOString())
      .lte('end_time', endOfDay.toISOString()); 
      
    if (error2) throw error2;
    
    // Veya başlangıcı bugünden önce bitişi bugünden sonra olan (bugünü kapsayanlar)
    const { data: plansSpanningToday, error: error3 } = await supabase
      .from('plans')
      .select('*')
      .eq('user_id', userId)
      .lt('start_time', startOfDay.toISOString())
      .gt('end_time', endOfDay.toISOString());
    
    if (error3) throw error3;
    
    // Tüm planları birleştir, tekrar edenleri çıkar
    const allPlans = [...(plansStartingToday || []), ...(plansEndingToday || []), ...(plansSpanningToday || [])];
    const uniquePlans = Array.from(new Map(allPlans.map(plan => [plan.id, plan])).values());
    
    // Başlangıç saatine göre sırala
    return uniquePlans.sort((a, b) => {
      return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
    });
  },

  // Hazır plan işlemleri
  async createQuickPlan(data: NewQuickPlanData, userId: string): Promise<QuickPlan> {
    const { data: quickPlan, error } = await supabase
      .from('quick_plans')
      .insert([{ ...data, user_id: userId }])
      .select()
      .single();

    if (error) throw error;
    return quickPlan;
  },

  async updateQuickPlan(id: number, data: Partial<NewQuickPlanData>, userId: string): Promise<QuickPlan> {
    const { data: quickPlan, error } = await supabase
      .from('quick_plans')
      .update(data)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return quickPlan;
  },

  async deleteQuickPlan(id: number, userId: string): Promise<void> {
    const { error } = await supabase
      .from('quick_plans')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
  },

  async getAllQuickPlans(userId: string): Promise<QuickPlan[]> {
    const { data: quickPlans, error } = await supabase
      .from('quick_plans')
      .select('*')
      .or(`is_system.eq.true,user_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return quickPlans || [];
  },

  // Yeni eklenen fonksiyonlar
  async hideQuickPlan(planId: number, userId: string): Promise<void> {
    const { error } = await supabase
      .from('user_hidden_plans')
      .insert([{ 
        quick_plan_id: planId,
        user_id: userId
      }]);

    if (error) throw error;
  },

  async showQuickPlan(planId: number, userId: string): Promise<void> {
    const { error } = await supabase
      .from('user_hidden_plans')
      .delete()
      .eq('quick_plan_id', planId)
      .eq('user_id', userId);

    if (error) throw error;
  },

  async getHiddenQuickPlans(userId: string): Promise<number[]> {
    const { data, error } = await supabase
      .from('user_hidden_plans')
      .select('quick_plan_id')
      .eq('user_id', userId);

    if (error) throw error;
    return data?.map(item => item.quick_plan_id) || [];
  }
};
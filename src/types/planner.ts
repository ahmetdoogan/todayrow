// Ana plan türleri
export type PlanType = 'custom' | 'predefined';

// Temel plan verisi
export interface Plan {
  id: number;
  user_id: string;
  title: string;
  details?: string;
  start_time: string;
  end_time: string;
  is_completed: boolean;
  plan_type: PlanType;
color: string;
  quick_plan_id?: number;
  parent_plan_id?: number;
  order: number;
  created_at: string;
  updated_at: string;
}

// Yeni plan oluştururken kullanılacak veri tipi
export type NewPlanData = Omit<Plan, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'is_completed'>;

// Plan güncelleme verisi
export type PlanUpdateData = Partial<NewPlanData>;

// Hazır plan verisi
export interface QuickPlan {
  id: number;
  user_id: string;
  title: string;
  color?: string;
  is_system: boolean;
  created_at: string;
  updated_at: string;
}

// Yeni hazır plan oluştururken kullanılacak veri tipi
export type NewQuickPlanData = Omit<QuickPlan, 'id' | 'user_id' | 'created_at' | 'updated_at'>;

// Context için state tipleri
export interface PlannerState {
  plans: Plan[];
  quickPlans: QuickPlan[];
  selectedDate: Date | null;
  selectedPlan: Plan | null;
  isModalOpen: boolean;
  view: 'today' | 'tomorrow' | 'yesterday';
}

// Context için action tipleri
export interface PlannerContextType extends PlannerState {
  // Plan işlemleri
  createPlan: (data: NewPlanData) => Promise<Plan>;
  updatePlan: (id: number, data: PlanUpdateData) => Promise<Plan>;
  deletePlan: (id: number) => Promise<void>;
  completePlan: (id: number) => Promise<void>;
  
  // Hazır plan işlemleri
  createQuickPlan: (data: NewQuickPlanData) => Promise<QuickPlan>;
  updateQuickPlan: (id: number, data: Partial<NewQuickPlanData>) => Promise<QuickPlan>;
  deleteQuickPlan: (id: number) => Promise<void>;
  
  // UI işlemleri
  setSelectedDate: (date: Date | null) => void;
  setSelectedPlan: (plan: Plan | null) => void;
  setIsModalOpen: (isOpen: boolean) => void;
  setView: (view: PlannerState['view']) => void;
}
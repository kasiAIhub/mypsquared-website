export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      assessments: {
        Row: {
          child_name: string
          circumstance_other: string | null
          circumstance_triggers: string[] | null
          created_at: string
          curriculum_recommendations: Json | null
          desired_services: string | null
          education_priorities: string[] | null
          goals: Json | null
          grade: string
          id: string
          learning_style: string
          learning_style_scores: Json | null
          mission: string | null
          parent_email: string
          parent_name: string | null
          parent_phone: string | null
          parenting_approach: string | null
          pdf_download_count: number | null
          pdf_downloaded_at: string | null
          pdf_generated: boolean | null
          top_curriculum: string | null
          values: string | null
        }
        Insert: {
          child_name: string
          circumstance_other?: string | null
          circumstance_triggers?: string[] | null
          created_at?: string
          curriculum_recommendations?: Json | null
          desired_services?: string | null
          education_priorities?: string[] | null
          goals?: Json | null
          grade: string
          id?: string
          learning_style: string
          learning_style_scores?: Json | null
          mission?: string | null
          parent_email: string
          parent_name?: string | null
          parent_phone?: string | null
          parenting_approach?: string | null
          pdf_download_count?: number | null
          pdf_downloaded_at?: string | null
          pdf_generated?: boolean | null
          top_curriculum?: string | null
          values?: string | null
        }
        Update: {
          child_name?: string
          circumstance_other?: string | null
          circumstance_triggers?: string[] | null
          created_at?: string
          curriculum_recommendations?: Json | null
          desired_services?: string | null
          education_priorities?: string[] | null
          goals?: Json | null
          grade?: string
          id?: string
          learning_style?: string
          learning_style_scores?: Json | null
          mission?: string | null
          parent_email?: string
          parent_name?: string | null
          parent_phone?: string | null
          parenting_approach?: string | null
          pdf_download_count?: number | null
          pdf_downloaded_at?: string | null
          pdf_generated?: boolean | null
          top_curriculum?: string | null
          values?: string | null
        }
        Relationships: []
      }
      dbe_documents: {
        Row: {
          created_at: string
          document_name: string
          document_type: string
          download_count: number | null
          file_size_bytes: number | null
          file_url: string
          id: string
          is_current_version: boolean | null
          last_downloaded_at: string | null
          registration_id: string
          version: number | null
        }
        Insert: {
          created_at?: string
          document_name: string
          document_type: string
          download_count?: number | null
          file_size_bytes?: number | null
          file_url: string
          id?: string
          is_current_version?: boolean | null
          last_downloaded_at?: string | null
          registration_id: string
          version?: number | null
        }
        Update: {
          created_at?: string
          document_name?: string
          document_type?: string
          download_count?: number | null
          file_size_bytes?: number | null
          file_url?: string
          id?: string
          is_current_version?: boolean | null
          last_downloaded_at?: string | null
          registration_id?: string
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "dbe_documents_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: false
            referencedRelation: "dbe_registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      dbe_funnel_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          metadata: Json
          province: string | null
          session_id: string
          step_name: string | null
          step_number: number | null
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          metadata?: Json
          province?: string | null
          session_id: string
          step_name?: string | null
          step_number?: number | null
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          metadata?: Json
          province?: string | null
          session_id?: string
          step_name?: string | null
          step_number?: number | null
        }
        Relationships: []
      }
      dbe_registrations: {
        Row: {
          assessment_id: string | null
          child_date_of_birth: string
          child_full_name: string
          child_id_number: string
          chosen_curriculum: string | null
          city: string
          coach_access_granted: boolean | null
          coach_access_starts: string | null
          created_at: string
          dbe_approval_received_at: string | null
          dbe_download_count: number | null
          dbe_package_downloaded: boolean | null
          dbe_package_downloaded_at: string | null
          dbe_package_generated: boolean | null
          dbe_package_generated_at: string | null
          dbe_package_pdf_url: string | null
          dbe_reference_number: string | null
          dbe_submission_status: string | null
          dbe_submitted_by_parent_at: string | null
          grade: string
          id: string
          internal_notes: string | null
          last_contact_at: string | null
          parent_email: string
          parent_full_name: string
          parent_phone: string | null
          payment_amount: number | null
          payment_method: string | null
          payment_received_at: string | null
          payment_reference: string | null
          payment_status: string | null
          postal_code: string
          province: string
          street_address: string
          suburb: string
          support_tickets_count: number | null
        }
        Insert: {
          assessment_id?: string | null
          child_date_of_birth: string
          child_full_name: string
          child_id_number: string
          chosen_curriculum?: string | null
          city: string
          coach_access_granted?: boolean | null
          coach_access_starts?: string | null
          created_at?: string
          dbe_approval_received_at?: string | null
          dbe_download_count?: number | null
          dbe_package_downloaded?: boolean | null
          dbe_package_downloaded_at?: string | null
          dbe_package_generated?: boolean | null
          dbe_package_generated_at?: string | null
          dbe_package_pdf_url?: string | null
          dbe_reference_number?: string | null
          dbe_submission_status?: string | null
          dbe_submitted_by_parent_at?: string | null
          grade: string
          id?: string
          internal_notes?: string | null
          last_contact_at?: string | null
          parent_email: string
          parent_full_name: string
          parent_phone?: string | null
          payment_amount?: number | null
          payment_method?: string | null
          payment_received_at?: string | null
          payment_reference?: string | null
          payment_status?: string | null
          postal_code: string
          province: string
          street_address: string
          suburb: string
          support_tickets_count?: number | null
        }
        Update: {
          assessment_id?: string | null
          child_date_of_birth?: string
          child_full_name?: string
          child_id_number?: string
          chosen_curriculum?: string | null
          city?: string
          coach_access_granted?: boolean | null
          coach_access_starts?: string | null
          created_at?: string
          dbe_approval_received_at?: string | null
          dbe_download_count?: number | null
          dbe_package_downloaded?: boolean | null
          dbe_package_downloaded_at?: string | null
          dbe_package_generated?: boolean | null
          dbe_package_generated_at?: string | null
          dbe_package_pdf_url?: string | null
          dbe_reference_number?: string | null
          dbe_submission_status?: string | null
          dbe_submitted_by_parent_at?: string | null
          grade?: string
          id?: string
          internal_notes?: string | null
          last_contact_at?: string | null
          parent_email?: string
          parent_full_name?: string
          parent_phone?: string | null
          payment_amount?: number | null
          payment_method?: string | null
          payment_received_at?: string | null
          payment_reference?: string | null
          payment_status?: string | null
          postal_code?: string
          province?: string
          street_address?: string
          suburb?: string
          support_tickets_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "dbe_registrations_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      homeschooling_coach_waitlist: {
        Row: {
          assessment_id: string | null
          created_at: string
          email: string
          id: string
          name: string | null
          phone: string | null
          source: string | null
        }
        Insert: {
          assessment_id?: string | null
          created_at?: string
          email: string
          id?: string
          name?: string | null
          phone?: string | null
          source?: string | null
        }
        Update: {
          assessment_id?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          phone?: string | null
          source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "homeschooling_coach_waitlist_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      learner_blueprint_waitlist: {
        Row: {
          created_at: string
          curriculum: string
          grade: string
          id: string
          parent_name: string
          whatsapp_number: string
        }
        Insert: {
          created_at?: string
          curriculum: string
          grade: string
          id?: string
          parent_name: string
          whatsapp_number: string
        }
        Update: {
          created_at?: string
          curriculum?: string
          grade?: string
          id?: string
          parent_name?: string
          whatsapp_number?: string
        }
        Relationships: []
      }
      lesson_plan_requests: {
        Row: {
          child_description: string
          child_grade: string
          child_name: string
          created_at: string
          curriculum: string | null
          id: string
          learning_type: string
          parent_name: string
          status: string
          struggles: string | null
          subjects: string | null
          whatsapp_number: string
        }
        Insert: {
          child_description: string
          child_grade: string
          child_name: string
          created_at?: string
          curriculum?: string | null
          id?: string
          learning_type: string
          parent_name: string
          status?: string
          struggles?: string | null
          subjects?: string | null
          whatsapp_number: string
        }
        Update: {
          child_description?: string
          child_grade?: string
          child_name?: string
          created_at?: string
          curriculum?: string | null
          id?: string
          learning_type?: string
          parent_name?: string
          status?: string
          struggles?: string | null
          subjects?: string | null
          whatsapp_number?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      waitlist_rate_limits: {
        Row: {
          created_at: string
          id: string
          visitor_hash: string
        }
        Insert: {
          created_at?: string
          id?: string
          visitor_hash: string
        }
        Update: {
          created_at?: string
          id?: string
          visitor_hash?: string
        }
        Relationships: []
      }
      waitlist_signups: {
        Row: {
          created_at: string
          email: string
          id: string
          source: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          source?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          source?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const

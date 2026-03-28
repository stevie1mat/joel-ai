export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      characters: {
        Row: {
          id: string
          user_id: string | null
          name: string
          class: string
          stats: Json
          level: number
          xp: number | null
          current_hp: number | null
          allegiance: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          name: string
          class: string
          stats: Json
          level?: number
          xp?: number | null
          current_hp?: number | null
          allegiance?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          name?: string
          class?: string
          stats?: Json
          level?: number
          xp?: number | null
          current_hp?: number | null
          allegiance?: string | null
          avatar_url?: string | null
          created_at?: string
        }
      }
      character_inventory: {
        Row: {
          id: string
          character_id: string
          item_template_id: string
          quantity: number
          created_at: string
        }
        Insert: {
          id?: string
          character_id: string
          item_template_id: string
          quantity?: number
          created_at?: string
        }
        Update: {
          id?: string
          character_id?: string
          item_template_id?: string
          quantity?: number
          created_at?: string
        }
      }
      item_templates: {
        Row: {
          id: string
          name: string
          description: string | null
          type: string
          rarity: string
          stats: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          type: string
          rarity?: string
          stats?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          type?: string
          rarity?: string
          stats?: Json | null
          created_at?: string
        }
      }
      narrative_history: {
        Row: {
          id: string
          user_id: string
          character_id: string
          role: string
          content: string
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          character_id: string
          role: string
          content: string
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          character_id?: string
          role?: string
          content?: string
          metadata?: Json | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
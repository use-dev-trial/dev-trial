export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      challenge_question: {
        Row: {
          challenge_id: string;
          question_id: string;
          user_id: string;
        };
        Insert: {
          challenge_id: string;
          question_id: string;
          user_id?: string;
        };
        Update: {
          challenge_id?: string;
          question_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'challenge_question_challenge_id_fkey';
            columns: ['challenge_id'];
            isOneToOne: false;
            referencedRelation: 'challenges';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'challenge_question_question_id_fkey';
            columns: ['question_id'];
            isOneToOne: false;
            referencedRelation: 'questions';
            referencedColumns: ['id'];
          },
        ];
      };
      challenges: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          name: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name: string;
          updated_at?: string;
          user_id?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      files: {
        Row: {
          code: string | null;
          created_at: string;
          id: string;
          name: string | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          code?: string | null;
          created_at?: string;
          id?: string;
          name?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Update: {
          code?: string | null;
          created_at?: string;
          id?: string;
          name?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      messages: {
        Row: {
          created_at: string;
          id: string;
          messages: Json[];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          messages: Json[];
          user_id?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          messages?: Json[];
          user_id?: string;
        };
        Relationships: [];
      };
      problems: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          requirements: string[] | null;
          title: string | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          requirements?: string[] | null;
          title?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          requirements?: string[] | null;
          title?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      question_file: {
        Row: {
          file_id: string;
          question_id: string;
          user_id: string;
        };
        Insert: {
          file_id: string;
          question_id: string;
          user_id?: string;
        };
        Update: {
          file_id?: string;
          question_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'question_file_file_id_fkey';
            columns: ['file_id'];
            isOneToOne: false;
            referencedRelation: 'files';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'question_file_question_id_fkey';
            columns: ['question_id'];
            isOneToOne: false;
            referencedRelation: 'questions';
            referencedColumns: ['id'];
          },
        ];
      };
      question_test_case: {
        Row: {
          question_id: string;
          test_case_id: string;
          user_id: string;
        };
        Insert: {
          question_id: string;
          test_case_id: string;
          user_id?: string;
        };
        Update: {
          question_id?: string;
          test_case_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'question_test_case_question_id_fkey';
            columns: ['question_id'];
            isOneToOne: false;
            referencedRelation: 'questions';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'question_test_case_test_case_id_fkey';
            columns: ['test_case_id'];
            isOneToOne: false;
            referencedRelation: 'test_cases';
            referencedColumns: ['id'];
          },
        ];
      };
      questions: {
        Row: {
          created_at: string;
          id: string;
          problem_id: string | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          problem_id?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          problem_id?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'questions_problem_id_fkey';
            columns: ['problem_id'];
            isOneToOne: false;
            referencedRelation: 'problems';
            referencedColumns: ['id'];
          },
        ];
      };
      test_cases: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      requesting_user_id: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    ? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema['Enums'] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
    ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

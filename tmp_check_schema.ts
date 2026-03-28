
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkSchema() {
    const { data, error } = await supabase.from('characters').select('*').limit(1);
    if (error) {
        console.error('Error fetching character:', error);
    } else {
        console.log('Character sample data structure:', JSON.stringify(data[0], null, 2));
    }
}

checkSchema();

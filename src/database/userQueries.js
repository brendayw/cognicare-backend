import supabase from '../config/db.js'

// query para verificar si existe un usuario registrado
// con ese mail y para obtener un usuario por su email
export async function verifyRegisteredEmailQuery (email) {
  const { data, error } = await supabase
    .from('usuario')
    .select('*')
    .eq('email', email)

  if (error) throw error
  return data
}

// query para crear el usuario
export async function createUserQuery (usuario, email, password) {
  const { data, error } = await supabase
    .from('usuario')
    .insert([{ usuario, email, password }])

  if (error) throw error
  return data
}

// actualiza la contraseña del usuario
export async function updatePasswordQuery (email, newHashedPassword) {
  const { data, error } = await supabase
    .from('usuario')
    .update({
      password: newHashedPassword,
      updatedAt: new Date().toISOString()
    })
    .eq('email', email)
    .select('id, email')

  if (error) throw error
  return data
}

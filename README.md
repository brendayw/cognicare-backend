# Cognicare

Backend desarrollado para el sistema web de gestión orientado a profesionales de la salud (psicologos/as y psicopedagogos/as) que permite organizar pacientes, registrar evaluaciones, generar reportes/tests y llevar un registro de las sesiones y su avance en el tratamiento. 

El objetivo principal es optimizar la gestión clínica y administrativa, facilitando el seguimiento individualizado de cada paciente.

## Tecnologías utilizadas
    • Frontend: React
    • Backend: Node.js + Express
    • Base de datos: PostgreSQL (gestionado con Supabase)
    • Comunicación API: Axios
    • Control de versiones: Git

## Tabla de Contenidos

### **Requisitos**
    • Node.js v22.15.0
    • npm
    • PostgreSQL o cuenta de Supabase (con credenciales)
    • Git

### **Instalación**

#### Clonar repositorios:

    • Frontend
        git clone https://github.com/brendayw/cognicare-frontend

    • Backend: 
        git clone https://github.com/brendayw/cognicare-backend

#### Instalar dependencias:

    npm install

#### Iniciar servidores:

    • Frontend
        npm run dev

    • Backend
        node app.js

### **Configuración**

    Crear el archivo .env con las variables de entorno para el backend:

        • Configuraciones del servidor
        • Configuración de supabase
        • Configuración de PostgreSQL

### **Estructura del proyecto**

#### Frontend

    public
    │   └───assets                  # Imagenes y recursos estáticos
    └───src
        ├───components              # Componentes UI
        │   ├───assessments             # Evaluaciones y formularios
        │   ├───auth                    # Inicio de sesión, cierre, validación de usuarios
        │   ├───dashboard               # Tarjetas e interfaces del panel principal
        │   ├───layout                  # Menu y estructura base
        │   ├───patients                # Gestión de pacientes (listados, formularios, tabs)
        │   ├───professional            # Gestión de datos del profesional
        │   ├───reports                 # Reportes y formularios
        │   ├───sessions                # Sesiones y formularios
        │   ├───settings                # Configuración personal y ajustes
        │   └───ui                      # Elementos reutilizables

        ├───hooks                   # Hooks perzonalizados
        │   ├───assessments
        │   ├───patients
        │   ├───professional
        │   ├───reports
        │   ├───sessions
        │   └───user

        ├───pages                   # Rutas principales y vistas secundarias internas
        │   ├───dashboard                # Acceso a listados y formularios
        │   ├───patients                 # Acceso a listados, formularios, reportes, evaluaciones y sesiones
        │   └───professional             # Acceso a formulario

        ├───skeletons               # Componentes visuales de carga
        │   ├───charts
        │   ├───headers
        │   ├───lists
        │   ├───patients
        │   └───professional

        └───styles                  # Estilos organizados por sección o pantalla
            ├───dashboard
            ├───patients
            ├───profesional
            └───settings

#### Backend

    ├───src
    │   ├───config                  # Configuracion de la base de datos
    │   ├───controllers             # Lógica de cada endpoint
    │   ├───database                # Consultas a la base de datos
    │   ├───helpers                 # Funciones auxiliares (hashPassword)
    │   ├───middleware              # Middlewares para autenticación y manejo de archivos
    │   ├───models                  # Modelos y definicion de rutas base
    │   ├───routes                  # Rutas específicas organizadas por entidad
    │   └───utils                   # Utilidades generales

    └───uploads                     # Carpeta donde se almacenan los archivos subidos


### **Frontend**

- App.jsx: es la pantalla desde la cual se puede inciar sesión o crear una cuenta, conteniendo los componentes LoginForm.jsx y SignUpForm.jsx, dependiendo de cual sea la que se encuentre activa.

- main.jsx: configura el enrutamiento principal de la aplicación.

- index.css: contiene los estilos base y las configuraciones globales

- App.css: incluye las directivas esenciales para Tailwind

#### Componentes

    - Assessments: contiene componentes que listan las evaluaciones de cada paciente (AssessmentsList.jsx).
        - assessmentsForms: contiene formularios para registrar una evaluación (AssessmentForm.jsx), editarla (EditAssessmentForm.jsx) o eliminarla (softDeleteAssessment.jsx).

    - Auth: contiene los componentes para iniciar sesión (LoginForm.jsx), crearse una cuenta (SignUpForm.jsx) y resetear la contraseña en caso de habersela olvidado (ResetPasswordForm.jsx).

    - Dashboard: contiene componentes que se utilizan en el panel principal como 
        - botones para registrar pacientes, evaluaciones, etc. (AddButtons.jsx).
        - calendario (Calendar.jsx).
        - gráfico que visualiza los pacientes registrados y sus categorías
        - botones con listados por categorías de pacientes (en diagnóstico, tratamiento o de alta) (PatientsCategories.jsx)
        - tarjeta con datos principales del profesional (ProfileCard.jsx).
        - listado de los últimos pacientes creados por ese profesional (RecentlyCreatedPatients.jsx).

    - Layout: es el wrapper (diseño base) que estructura como se van a renderizar las páginas y el componete Menú 

    - Patients: contiene listados, formularios, el perfil del paciente y sus solapas
        - patientLists: contiene los listados de pacientes en período de diagnóstico (DiagnosisList.jsx), tratamiento (TreatmentList.jsx) o de alta (DischargedList.jsx), además de un listado con todos los pacientes registrados por ese profesional (PatientsList.jsx).
        - patientProfile: contiene los componentes que se usan en el perfil del paciente como sus datos personales (PatientData.jsx y PatientName.jsx) y su progreso en sesiones (PatientProgress.jsx), además de un header con opciones de volver atrás, editar o eliminar al paciente (PatientProfileHeader.jsx).
        - patientsForms: contiene los formularios para registrar un paciente (PatientForm.jsx), editarlo (EditPatientForm.jsx) o eliminarlo (softDeletePatient.jsx).
        - tabs: contiene las solapas visibles en el perfil del paciente (ResumeTab.jsx y LastSessionTab.jsx)
            - resumen-tab: contiene un pantallazo general a la historia clínica del paciente (HistoryResume.jsx), con algunas evaluaciones (AssessmentsResume.jsx) y reportes (ReportsResume.jsx) desde los cuales se puede acceder a todos ellos a partir de un listado que te permite editarlos o borrarlos.
            - ultimasesion-tab: contiene un resumen de la última sesion registrada (LastSession.jsx) y un historial de sesiones (HistorySessions.jsx).

    - Professional: contiene los componentes que se ven en el perfil del paciente y formularios
        - professionalForms: contiene formularios para editar los datos del profesional (EditProfessionalForm.jsx) o eliminarlo (softDeleteProfessional.jsx).
        - botones para ver los listados de pacientes y para registrar pacientes, evaluaciones, etc. (Buttons.jsx)
        - gráfico con las sesiones para poder visualizar el progreso del paciente (Chart.jsx).
        - datos del profesional (ProfessionalCard.jsx).
        - informacion detallada con los días de atención y horarios (MoreInfo.jsx).
        - listado con los últimos pacientes actualizados (en caso de no haber actualizados, muestra últimos creados) (RecentlyUpdatedPatients.jsx).

    - Reports: contiene componentes que listan los reportes de cada paciente (ReportsList.jsx).
        - reportsForms: contiene formularios para registrar un reporte (ReportForm.jsx), editarlo (EditReportForm.jsx) o eliminarlo (softDeleteReport.jsx).

    - Sessions: contiene componentes que listan las sesiones de cada paciente (SessionsList.jsx).
        - sessionsForms: contiene formularios para registrar una sesión (SessionForm.jsx), editarla (EditSessionForm.jsx) o eliminarla (softDeleteSession.jsx).

    - Settings: contiene el componente el menú de pestañas que permite cambiar de solapa (PanelSettings.jsx) y las solapas
        - para registrar los datos del profesional (ProfileTab.jsx).
        - para cambiar la contraseña (PasswordTab.jsx).
        - para eliminar el profesional (DeactivateTab.jsx).

    - UI: contiene los componentes reutilizables como el menu (Menu.jsx), la barra de busqueda por nombre del paciente (SearchBar.jsx), lista de usuarios (UserList.jsx), selector de vista para listado o grilla (ViewSelector.jsx), título de la solapa (TabTitle.jsx), cuadro de diálogo para confirmar la eliminación (ConfirmationDialog.jsx), selector de solapa en el perfil del paciente (CustomTabs.jsx), y otros para los formularios (FormButton.jsx, FormCheckbox.jsx, FormHeader.jsx, FormInput.jsx, FormSelect.jsx).

#### Hooks

Maneja la obtencion de datos desde la api de las evaluaciones (assessments), pacientes (patients), profesional (professional), reportes (reports), sesiones (sessiones) y usuario (user)

    - Assessments: maneja la obtencion de todas las evaluaciones del paciente para luego asociarlas a un reporte (useAssessment.jsx), los datos de cada evaluación asociada al paciente (useAssessmentsData.jsx), el registro de evaluaciones (useAssessmentForm.jsx) y la edición de la evaluación (useEditAssessment.jsx).

    - Patients: maneja la obtención de datos de los listados de pacientes (usePatients.jsx, useDiagnosisData.jsx, useDischargedData.jsx, useTreatmentData.jsx), la obtencion del estado del paciente (diagnóstico, tratamiento de alta) (usePatientStatusData.jsx), la obtención del progreso del paciente (sesiones realizadas y totales) (usePatientSessionsData.jsx), la obtención de datos de cada paciente (usePatientData.jsx), el registro de un paciente (usePatientForm.jsx), la edicíon (useEditPatient.jsx) y los listados de pacientes recien creados (useRecentlyCreated.jsx) y recien actualizados (useRecentlyUpdated.jsx)

    - Professional: maneja la obtencion los datos de cada profesional (useProfessionalData.jsx), el registro del profesional (useProfessionalForm.jsx) y la edición de los datos del mismo (useEditProfessional.jsx).

    - Reports: maneja la obtención de los datos de cada reporte asociado al paciente (useReportsData.jsx), el registro de reportes (useReportForm.jsx) y la edición del reporte (useEditReport.jsx).

    - Sessions: maneja la obtencion los datos de cada sesión asociada al paciente (useSessionsData.jsx), el registro de sesiones (useSessionsForm.jsx) y la edición del reporte (useEditSession.jsx).

    - User: maneja la petición para el inicio de sesión (useLogin.jsx), creación de cuenta (useSignUp.jsx), reseteo de contraseña (useResetPassword.jsx) o cambio de la misma (usePasswordUpdate.jsx) y el cierre de sesión (useLogOut.jsx).

#### Pages

    - Dashboard: es el panel principal que muestra los componentes ProfileCard, PatientsCategories, PatientsChart, Calendar, AddButtons y RecentlyCreatedPatients
        - desde AddButtons se puede acceder a los formularios de regitro de pacientes (Patient.jsx), evaluación (Assessment.jsx), reporte (Report.jsx) y sesión (Session.jsx).
        - desde los botones de PatientsCategories se puede acceder a los listados de pacientes en período de diagnóstico (Diagnosis.jsx), en tratamiento (Treatment.jsx) o dados de alta (Discharged.jsx).
    
    - Patients: es la vista o pantalla que contiene el listado de todos los pacientes registrados por el profesional.
        - cada paciente listado permite acceder a su perfil (PatientProfile.jsx) y de alli al formulario de edición (EditPatient.jsx).
            - PatientProfile: contiene los componentes PatientProfileHeader, PatientName, PatientData, PatientProgress y CustomTabs.
                - una vez en el perfil de cada paciente se puede acceder desde la solapa resumen a los listados de evaluaciones (Assessments.jsx) y reportes (Reports.jsx) asociadas a cada paciente.
                    - desde cada listado se puede acceder al formulario de edición de la evaluación (EditAssessment.jsx) o reporte (EditReport.jsx)
                - a su vez, una vez en el perfil y desde la solapa sesión se puede acceder al listado de sesiones registradas y asociadas al paciente (Sessions.jsx).
                    - desde el listado se puede acceder al formulario de edición de la sesión (EditSession.jsx).

    - Professional: es la vista del perfil del profesional (ProfessionalProfile.jsx) que contiene los componentes ProfessionalCard, Buttons, Chart, MoreInfo, y RecentlyUpdatedPatients
        - desde ProfessionalCard se puede acceder al formulario de edición (EditProfessional.jsx).

    - Settings: es la vista que contiene los componentes PanelSettings que permite acceder a las solapas que registran al profesional (ProfileTab), cambian la contraseña (PasswordTab) o eliminar el profesional (DeactivateTab).

#### Skeletons 

    - Charts: contiene los componentes visuales de carga para PatientsChart (SkeletonPatientsChart.jsx) y Chart (SkeletonPatientSessions.jsx)

    - Headers: contiene los componentes visuales de carga ProfileCard (SkeletonHeader.jsx) y ProfessionalCard (SkeletonProfileHeader.jsx)

    - Lists: contiene los componentes visuales de carga para PatientsList, DiagnosisList, TreatmentList, DischargedList que llevan icono (SkeletonListItemWithIcon.jsx); para los listados de pacientes recien creados y recien actualizados (SkeletonPatientsList.jsx) y para los listados de evaluaciones, reportes y sesiones (SkeletonListItem.jsx). 

    - Patients: contiene los componentes visuales de carga para PatientProfile (SkeletonData.jsx, SkeletonPatientName.jsx y SkeletonProgress.jsx) y para el contenido de las solapas del perfil del paciente (SkeletonAssessments.jsx, SkeletonHistory.jsx, SkeletonReports.jsx y SkeletonSessions.jsx).

    - Professional: contiene el contenido visual de carga para el componente MoreInfo (SkeletonProfessionalData.jsx).

#### *Dependencias*

    Core
    - React 19 (Beta)
    - Vite (Build tool)
    - JavaScript ES6+

    UI/UX
    - Material-UI v7 (Componentes principales)
    - MUI X (Gráficos y Date Pickers)
    - Tailwind CSS (Utilidades CSS)
    - Emotion (Estilos CSS-in-JS)

    Utilidades
    - Axios (HTTP Client)
    - date-fns (Manejo de fechas)
    - React Router v7 (Navegación)

    Herramientas de Desarrollo
    - ESLint (Linter JavaScript)
    - Tailwind CSS + PostCSS (Procesamiento CSS)
    - Vite Plugins (Optimización build)

### **Backend**

- app.js: importa las dependencias, debuggea las variables de entorno, crea e inicia el servidor.

#### Config

##### **db.js**: 
    es el archivo de configuración para interactuar con la base de datos (en supabase). Verifica que las variables de entorno requeridas (SUPABASE_URL) y (SUPABASE_KEY) estén definidas antes de crear la conexión.

#### Controllers

    Gestiona las operaciones CRUD de cada entidad.

##### **assessmentController.js**

###### **logAssessment**: crea una nueva evaluación asociada a un paciente y a un profesional.

**Body**

        {
            "fecha_evaluacion": "YYYY-MM-DD",
            "nombre_evaluacion": "string",
            "tipo_evaluacion": "string",
            "resultado": "string",
            "observaciones": "string (opcional),
            "id_profesional": int,
            "id_paciente": int
        }

**Flujo**

1. Valida los campos obligatorios
2. Busca el paciente por nombre.
3. Registra la evaluación

**Respuestas**
        
        200: Éxito. Retorna los datos de la evaluación creada.
        400: Faltan campos obligatorios.
        404: Paciente no encontrado.
        500: Error del servidor.
 
###### **getAssessments**: obtiene todas las evaluaciones realizadas o registradas por un profesional.

**Headers**: Authorization: Bearer < token >

**Flujo**

1. Valida que el ID del profesional exista.
2. Consulta las evaluaciones en la BDD.
3. FOrmatea los datos para incluir información del paciente.

**Respuestas**

        200: Éxito. Retorna lista de evaluaciones.
        404: Profesional no tiene evaluaciones registradas.
        500: Error del servidor.

###### **getAssessmentsByPatientId**: obtiene las evaluaciones especifícas asociadas a un paciente.

**Params**: ID del paciente.

**Flujo**

1. Valida el ID del paciente.
2. Consulta evaluaciones asociadas al paciente y al profesional.

**Respuestas**

    200: Éxito. Retorna evaluaciones del paciente.
    404: No se encontraron evaluaciones.
    500: Error del servidor.

###### **updateAssessment**: actualiza el resultado u observaciones de una evaluación.

**Params**: ID de la evaluación

**Body**

    {
        "id": int,
        "id_profesional": int,
        "resultado": "string" (opcional),
        "observaciones": "string (opcional)"
    }

**Flujo**

1. Valida que al menos un campo esté presente.
2. Actualiza la evaluación en la BDD.

**Respuestas**

    200: Éxito. Retorna evaluación actualizada.
    400: Faltan campos para actualizar.
    404: Evaluación no encontrada.
    500: Error del servidor.

###### **softDeleteAssessment**: realiza la eliminación lógica de la evaluación.

**Params**: ID de la evaluación.

**Flujo**

1. Valida el ID de la evaluación.
2. Marca la evaluación como eliminada (sin borrarla físicamente).

**Respuestas**

    200: Éxito. Confirmación de eliminación.
    400: ID inválido.
    500: Error del servidor.

##### **authController.js**:

###### **loginUser**: autentica a un usuario verificando su email y contaseña. Si las credenciales son validas, genera un token JWT para autorizar otras solicitudes.

**Body**

    {
        "email": "string",
        "password": "string"
    }

**Flujo**
1. Valida que los campos de email y password estén presentes.
2. Busca el usuario en la BDD a traves de el email (verifyRegisteredEmailQuery).
3. Compara las contraseña usando comparePassword (helper).
4. Genera el token.
5. Retorna los datos con la información del usuario y el token.

    Ejemplo de respuesta exitosa:

        {
            "success": true,
            "message": "Inicio de sesión exitoso",
            "user": {
                "username": "string",
                "email": "string"
            },
            "token": "string"
        }

**Respuestas**

    200: Éxito. Retorna token y datos del usuario.
    400: Credenciales inválidas.
    500: Error interno.

##### **patientController.js**:

###### **registerPatient**: crea un nuevo registro de paciente asociado al profesional autenticado.

**Body**

    {
        "nombre_completo": "string",
        "fecha_nacimiento": "YYYY-MM-DD",
        "edad": int,
        "genero": "string",
        "direccion": "string",
        "telefono": "string",
        "email": "string (opcional)",
        "fecha_inicio": "YYYY-MM-DD",
        "fecha_fin": "YYYY-MM-DD (opcional)",
        "motivo_inicial": "string",
        "motivo_alta": "string (opcional)",
        "sesiones_realizadas": int,
        "sesiones_totales": int,
        "estado": "string",
        "observaciones": "string (opcional)"
    }

**Flujo**

1. Valida los campos obligatorios.
2. Registra al paciente en la base de datos.
3. Asocia el paciente al profesional autenticado.

**Respuestas**

    200: Éxito. Retorna los datos del paciente creado.
    400: Faltan campos obligatorios.
    500: Error del servidor.

###### **getPatientProfile**: obtiene el perfil completo de un paciente en específico.

**Params**: ID del paciente.

**Flujo**

1. Valida el ID del paciente.
2. Consulta el perfil en la base de datos.
3. Verifica que el paciente pertenezca al profesional.

**Respuestas**

    200: Éxito. Retorna el perfil del paciente.
    404: Paciente no encontrado.
    500: Error del servidor.

###### **getAllPatients**: obtiene todos los pacientes asociados al profesional.

**Headers**: Authorization: Bearer < token >

**Flujo**

1. Obtiene el ID del profesional desde el token.
2. Consulta todos los pacientes asociados.
3. Retorna la lista formateada.

**Respuestas**

    200: Éxito. Retorna lista de pacientes.
    404: No hay pacientes registrados.
    500: Error del servidor.

###### **getPatientsUnderDiagnosis**: obtiene el listado de pacientes en período de diagnóstico asociados al profesional.

**Flujo**
1. Filtra pacientes por estado "diagnóstico".
2. Verifica que pertenezcan al profesional.

**Respuestas**

    200: Éxito. Retorna pacientes en diagnóstico.
    404: No hay pacientes en diagnóstico.
    500: Error del servidor.

###### **getPatientsUnderTreatment**: obtiene el listado de pacientes en tratamiento asociados al profesional.

**Flujo**

1. Filtra pacientes por estado "tratamiento".
2. Verifica que pertenezcan al profesional.

**Respuestas**

    200: Éxito. Retorna pacientes en tratamiento.
    404: No hay pacientes en tratamiento.
    500: Error del servidor.

###### **getPatientsDischarged**: obtiene el listado de pacientes dados de alta asociados al profesional.

**Flujo**

1. Filtra pacientes por estado "alta".
2. Verifica que pertenezcan al profesional.

**Respuestas**

    200: Éxito. Retorna pacientes dados de alta.
    404: No hay pacientes dados de alta.
    500: Error del servidor.

###### **getRecentlyUpdatedPatients**: obtiene el listado de pacientes actualizados recientemente asociados al profesional.

**Flujo**

1. Consulta pacientes ordenados por fecha de actualización.
2. Limita los resultados a los más recientes.

**Respuestas**

    200: Éxito. Retorna pacientes actualizados.
    404: No hay pacientes actualizados recientemente.
    500: Error del servidor.

###### **getLatestCreatedPatients**: obtiene el listado de pacientes últimos creados asociados al profesional.

**Flujo**

1. Consulta pacientes ordenados por fecha de creación.
2. Limita los resultados a los más recientes.

**Respuestas**

    200: Éxito. Retorna últimos pacientes creados.
    404: No hay pacientes registrados.
    500: Error del servidor.

###### **getPatientsByName**: busca a los pacientes por nombre.

**Params**: searchText (texto de búsqueda).

**Flujo**

1. Realiza búsqueda por coincidencia de nombre.
2. Retorna resultados filtrados.

**Respuestas**

    200: Éxito. Retorna pacientes encontrados.
    500: Error del servidor.

###### **updatePatient**: actualiza los datos de un paciente.

**Params**: ID del paciente

**Body**

    {
        "nombre_completo": "string (opcional)",
        "fecha_nacimiento": "YYYY-MM-DD (opcional)",
        "edad": "int (opcional)",
        "genero": "string (opcional)",
        "direccion": "string (opcional)",
        "telefono": "string (opcional)",
        "email": "string (opcional)",
        "fecha_inicio": "YYYY-MM-DD (opcional)",
        "fecha_fin": "YYYY-MM-DD (opcional)",
        "motivo_inicial": "string (opcional)",
        "motivo_alta": "string (opcional)",
        "sesiones_realizadas": "int (opcional)",
        "sesiones_totales": "int (opcional)",
        "estado": "string (opcional)",
        "observaciones": "string (opcional)"
    }

**Flujo**

1. Valida que al menos un campo sea proporcionado.
2. Actualiza los datos del paciente.
3. Verifica que el paciente pertenezca al profesional.

**Respuestas**

    200: Éxito. Retorna confirmación de actualización.
    400: No se proporcionaron campos para actualizar.
    404: Paciente no encontrado.
    500: Error del servidor.

###### **softDeletePatient**: realiza la eliminación lógica del paciente.

**Params**: ID del paciente.

**Flujo**

1. Valida el ID del paciente.
2. Marca al paciente como eliminado (sin borrarlo físicamente).
3. Verifica que el paciente pertenezca al profesional.

**Respuestas**

    200: Éxito. Retorna confirmación de eliminación.
    400: ID inválido.
    500: Error del servidor.


##### **profesionalController.js**

###### **registerProfesional**: registra un nuevo profesional asociado a un usuario.

**Body**

    {
        "nombre_completo": "string",
        "especialidad": "string",
        "matricula": "string",
        "telefono": "string",
        "email": "string",
        "fecha_nacimiento": "YYYY-MM-DD",
        "dias_atencion": "string",
        "horarios_atencion": "string",
        "genero": "string"
    }

**Flujo**

1. Valida los campos obligatorios.
2. Verifica que el email pertenezca al usuario autenticado.
3. Registra al profesional en la base de datos.

**Respuestas**

    200: Éxito. Retorna confirmación de registro.
    400: Faltan campos obligatorios o email no válido.
    403: No tiene permiso para registrar con ese email.
    500: Error del servidor.

###### **getProfesional**: obtiene el perfil del profesional autenticado

**Headers**: Authorization: Bearer < token >

**Flujo**

1. Obtiene el ID del usuario desde el token.
2. Consulta el perfil del profesional asociado.
3. Retorna los datos del profesional.

**Respuestas**

    200: Éxito. Retorna el perfil del profesional.
    404: Profesional no encontrado.
    500: Error del servidor.

###### **getProfesionalByUserId**: obtiene el profesional asociado a un ID de usuario.

**Params**: ID del usuario.

**Flujo**

1. Valida el ID del usuario.
2. Consulta el profesional asociado.
3. Retorna los datos del profesional.

**Respuestas**

    200: Éxito. Retorna el profesional encontrado.
    400: Falta el ID de usuario.
    404: No hay profesional asociado.
    500: Error del servidor.

###### **updateProfesional**: actualiza los datos de un profesional.

**Params**: ID del profesional.

**Body**

    {
        "email": "string (opcional)",
        "nombre_completo": "string (opcional)",
        "fecha_nacimiento": "YYYY-MM-DD (opcional)",
        "especialidad": "string (opcional)",
        "edad": "int (opcional)",
        "matricula": "string (opcional)",
        "telefono": "string (opcional)",
        "genero": "string (opcional)",
        "dias_atencion": "string (opcional)",
        "horarios_atencion": "string (opcional)"
    }

**Flujo**

1. Valida que al menos un campo sea proporcionado.
2. Actualiza los datos del profesional.
3. Retorna confirmación de actualización.

**Respuestas**

    200: Éxito. Retorna confirmación de actualización.
    400: No se proporcionaron campos para actualizar.
    404: Profesional no encontrado.
    500: Error del servidor.

###### **softDeleteProfesional**: realiza la eliminación lógica del profesional.

**Params**: ID del profesional.

**Flujo**

1. Valida el ID del profesional.
2. Marca al profesional como eliminado (sin borrarlo físicamente).
3. Retorna confirmación de eliminación.

**Respuestas**

    200: Éxito. Retorna confirmación de eliminación.
    400: ID inválido.
    404: Profesional no encontrado.
    500: Error del servidor.

##### **reportController.js**:

###### **logReport**: crea un nuevo reporte asociado a un paciente y evaluación, permitiendo almacenar un archivo.

**Body (multipart/form-data)**

    {
        "tipo_reporte": "string",
        "fecha_reporte": "YYYY-MM-DD",
        "descripcion": "string",
        "nombre_completo": "string",
        "id_evaluacion": int,
        "file": "archivo (obligatorio)"
    }

**Flujo**

1. Valida campos obligatorios y presencia de archivo.
2. Busca paciente por nombre completo.
3. Sube archivo a Supabase Storage.
4. Genera URL pública del archivo.
5. Valida formato de fecha.
6. Registra reporte en base de datos.

**Respuestas**

    200: Éxito. Retorna datos del reporte y URL del archivo.
    400: Faltan campos obligatorios o archivo no proporcionado.
    403: Error de permisos RLS en Supabase.
    404: Paciente no encontrado.
    500: Error del servidor.

###### **getReportsByPatientId**: obtiene todos los reportes asociados a un paciente.

**Params**: ID del paciente.

**Flujo**

1. Valida ID del paciente.
2. Consulta reportes asociados.
3. Retorna lista formateada.

**Respuestas**

    200: Éxito. Retorna lista de reportes.
    404: No se encontraron reportes.
    500: Error del servidor.

###### **updateReport**: actualiza un reporte existente, con opción de reemplazar archivo adjunto.

**Params**: ID del reporte.

**Body (multipart/form-data)**

    {
        "fecha_reporte": "YYYY-MM-DD (opcional)",
        "descripcion": "string (opcional)",
        "tipo_reporte": "string (opcional)",
        "file": "archivo (opcional)"
    }

**Flujo**

1. Valida que al menos un campo sea proporcionado.
2. Si hay archivo nuevo:
    - Sube a Supabase Storage.
    - Genera nueva URL pública.
3. Valida formato de fecha si se proporciona.
4. Actualiza registro en base de datos.

**Respuestas**

    200: Éxito. Retorna reporte actualizado.
    400: No se proporcionaron campos para actualizar.
    404: Reporte no encontrado.
    500: Error del servidor.

###### **softDeleteReport**: realiza la eliminación lógica del reporte.

**Params**: ID del reporte.

**Flujo**

1. Valida ID del reporte
2. Marca reporte como eliminado (no borra físicamente)
3. No elimina el archivo asociado en Storage

**Respuestas**

    200: Éxito. Retorna confirmación de eliminación.
    400: ID inválido.
    500: Error del servidor.

*Los archivos se almacenan en Supabase Storage bajo el bucket 'reportes'.*

##### **sessionController.js**

###### **logSession**: crea una nueva sesión asociada a un paciente.

**Body**
    {
        "fecha": "YYYY-MM-DD",
        "hora": "HH:MM:SS",
        "duracion": "string",
        "estado": "string",
        "tipo_sesion": "string",
        "observaciones": "string (opcional)",
        "nombre_completo": "string"
    }

**Flujo**

1. Valida campos obligatorios
2. Busca paciente por nombre completo
3. Registra sesión en base de datos
4. Asocia al profesional autenticado

**Respuestas**

    200: Éxito. Retorna datos de la sesión creada
    400: Faltan campos obligatorios o paciente no encontrado
    500: Error del servidor

###### **getSessionsByPatient**: obtiene todas las sesiones de un paciente específico.

**Params**: ID del paciente.

**Headers**: Authorization: Bearer < token >

**Flujo**

1. Valida ID del paciente.
2. Consulta sesiones asociadas al paciente y profesional.
3. Retorna lista formateada.

**Respuestas**

    200: Éxito. Retorna lista de sesiones.
    404: No se encontraron sesiones.
    500: Error del servidor.

###### **getLasSessionForPatient**: obtiene la última sesión registrada de un paciente.

**Params**: ID del paciente.

**Flujo**

1. Valida ID del paciente.
2. Consulta la última sesión por fecha.
3. Verifica que pertenezca al profesional.

**Respuestas**

    200: Éxito. Retorna última sesión.
    404: No se encontraron sesiones.
    500: Error del servidor.

###### **updateSession**: actualiza los datos de una sesión existente.

**Params**: ID de la sesión.

**Body**

    {
        "fecha": "YYYY-MM-DD (opcional)",
        "hora": "HH:MM:SS (opcional)",
        "duracion": "string (opcional)",
        "tipo_sesion": "string (opcional)",
        "estado": "string (opcional)",
        "observaciones": "string (opcional)"
    }

**Flujo**

1. Valida que al menos un campo sea proporcionado.
2. Actualiza los datos de la sesión.
3. Verifica que pertenezca al profesional.

**Respuestas**

    200: Éxito. Retorna sesión actualizada.
    400: No se proporcionaron campos para actualizar.
    404: Sesión no encontrada.
    500: Error del servidor.


###### **softDeleteSession**: realiza la eliminación lógica de la sesión.

**Params**: ID de la sesión.

**Flujo**

1. Valida ID de sesión.
2. Marca sesión como eliminada (soft delete).
3. Verifica que pertenezca al profesional.

**Respuestas**

    200: Éxito. Retorna confirmación de eliminación.
    400: ID inválido.
    500: Error del servidor.

##### **userController.js**

###### **registerUser**: registra un nuevo usuario.

**Body**
    {
        "usuario": "string",
        "email": "string",
        "password": "string"
    }

**Flujo**

1. Valida campos obligatorios.
2. Verifica si el email ya está registrado.
3. Hashea la contraseña.
4. Crea el usuario en la base de datos.

**Respuestas**

    200: Éxito. Usuario creado.
    400: Faltan campos o email ya registrado.
    500: Error del servidor.

###### **updatePassword**: actualiza la contraseña del usuario autenticado (por cambio voluntario).

**Body**

    {
        "oldPassword": "string",
        "newPassword": "string",
        "confirmedNewPassword": "string"
    }

**Flujo**

1. Valida que todos los campos estén presentes.
2. Verifica coincidencia de nuevas contraseñas.
3. Compara contraseña actual.
4. Hashea y almacena nueva contraseña.

**Respuestas**

    200: Contraseña actualizada.
    400: Validaciones fallidas.
    401: Contraseña actual incorrecta.
    404: Usuario no encontrado.
    500: Error del servidor.

###### **verifyEmail**: verifica si un email existe en el sistema (para recuperar la contraseña).

**Body**

    {
        "email": "string"
    }

**Flujo**

1. Busca el email en la base de datos.
2. Retorna estado de verificación.

**Respuestas**

    200: Email verificado (existe).
    404: Email no registrado.
    500: Error del servidor.
 
###### **resetPassword**: restablece la contraseña para un email verificado (recuperación).

**Body**
    {
        "email": "string",
        "password": "string",
        "confirmPassword": "string"
    }

**Flujo**

1. Valida coincidencia de contraseñas.
2. Verifica existencia del email.
3. Hashea y almacena nueva contraseña.

**Respuestas**

    200: Contraseña restablecida.
    400: Contraseñas no coinciden.
    404: Email no registrado.
    500: Error del servidor.

*Para seguridad se usa bcrypt para el hashing de contraseñas.*
*La recuperación de contraseña se realiza en dos pasos (verificación + reset).

#### Helpers

    Proporciona el manejo seguro de contraseñas utilizando el algoritmo de hashing bcrypt.

##### **hashPassword.js**

###### **hashPassword**: genera un hash seguro de una contraseña en texto plano.

*Parámetros*: password (string).

*Proceso*:

1. Genera un "salt" (valor aleatorio) con factor de costo 10
2. Crea el hash combinando la contraseña con el salt
3. Retorna el hash seguro listo para almacenar

###### **comparePassword**: verifica si una contraseña en texto plano coincide con un hash almacenado.

*Parámetros*: password (string), hashedPassword (string).

*Validaciones*

- Rechaza si falta alguno de los parámetros

*Retorno*

- true si la contraseña coincide.
- false si no coincide.

*El salt automático genera un valor único para cada hash.*
*El coste ajustable tiene un factor de trabajo 10 (balance entre seguridad y performance).*
*Posee una validación estricta, por ende rechaza operaciones con datos faltantes.*

#### Middleware

##### **authMiddleware**: implementa un middleware de autenticación para Node.js / Express que verifica la validez de tokens JWT.

**Flujo de Autenticación**

1. Extrae el token del header Authorization (formato: Bearer < token >).
2. Verifica existencia del token.
3. Valida el token usando el servicio AuthToken.
4. Adjunta datos decodificados al objeto req para uso posterior.
5. Permite el acceso (next()) o rechaza la solicitud.

**Respuestas**

* Éxito
    - Continúa al siguiente middleware/controlador.
    - Añade req.user con payload decodificado.

* Errores

|   Código	|           Mensaje             |                   Causa               |
|-----------|-------------------------------|---------------------------------------|
| 401       | No se proporcionó el token    | Falta header Authorization            |
| 401       | Token inválido o expirado     | Token malformado/expirado/inválido    |

##### **fileUpload**: implementa la librería multer para manejar la subida de archivos en solicitudes HTTP, con configuraciones de seguridad y validación.

**Almacenamiento en Memoria**

    - memoryStorage(): Procesa los archivos en memoria RAM en lugar de disco.

    *Beneficios*:
        • Más rápido para procesamiento inmediato.
        • No requiere limpieza de archivos temporales.
        • Ideal para integración con cloud storage.

**Filtrado de Archivos**

    Valida tipos MIME permitidos:
        [ 'image/jpeg', 'application/pdf', 'application/msword', 
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ]

**Formatos aceptados**

* Imágenes JPEG/JPG.
* Documentos PDF.
* Documentos Word (.doc y .docx).

**Límites de Seguridad**
* Tamaño máximo: 5MB (5 * 1024 * 1024 bytes).
* Protección contra:
    - Archivos maliciosos.
    - Denegación de servicio por archivos pesados.
    - Formatos no soportados.

**Mensajes de Error**
    
* 400 Bad Request:
    - "Formato de archivo no permitido" (extensiones no válidas)
    - "Archivo demasiado grande" (supera 5MB)
    - "No se proporcionó archivo" (falta campo file)

#### Models

##### **server.js**

Coniene la configuracion al servidor, gestiona la conexión a Supabase PostgreSQL y centraliza todas las rutas.

**Dependencias Principales**

| Paquete           | Función                                         |
|-------------------|-------------------------------------------------|
| express           | Framework para crear el servidor                |
| cors              | Habilita CORS para comunicación con el frontend |
| express-session   | Manejo de sesiones de usuario                   |
| pool (db.js)      | Conexión configurada a Supabase PostgreSQL      |

**Estructura de la clase**

1. Constructor: inicializa express y configura el puerto, prueba automáticamente la conexión a PostgreSQL, contiene middlewares esenciales y un sistema de rutas

2. Metodos Clave:

    * testPostgressConnection()
        - Verifica la conexión con Supabase PostgreSQL.
        - Realiza una consulta simple a la tabla usuario.
        - Respuestas:
            - Éxito: "Conexión exitosa a Supabase PostgreSQL".
            - Error: Muestra detalles del fallo.

    * middleware(): configura los middlewares globales:

        | Middleware            | Configuración                                     |
        |-----------------------|---------------------------------------------------|
        | cors                  | Permite peticiones desde dominios frontend        |
        | express.json          | Parsea bodies en formao JSON                      |
        | express-session       | Configura cookies seguras con duración de 1 día   |
        | directorios estaticos | Sirve archivos desde public o uploads             |

    * rutas

    * listen(): inicia el servidor en el puerto configurado.

**Configuración de seguridad**

| Elemento               | Detalle                                                                       |
|------------------------|-------------------------------------------------------------------------------|
| CORS                   | Solo permite: https://cognicare-frontend.vercel.app y http://localhost:5173   |
| Cookies                | httpOnly + secure (HTTPS)                                                     |
| Variables de entorno*  | Requiere: PORT, SESSION_SECRET                                                |

*Variables de entorno requeridas*
- PORT=5000
- SESSION_SECRET="tu_clave_secreta"
- SUPABASE_URL="tu_url"
- SUPABASE_KEY="tu_clave_anon/public"

#### Routes

    Contiene módulos separados por entidad, cada uno con sus endpoints específicos.

##### ***Endpoints***

Se puede a correr de manera local utilizando (http://localhost:5000/) o desde vercel (https://cognicare-backend.vercel.app/)

###### *Assessments*

| Método          | Ruta                                | Descripción                                               |
|-----------------|-------------------------------------|-----------------------------------------------------------|
| GET             | api/assessments                     | Obtiene todas las evaluaciones                            |
| GET             | api/patients/:id/assessments        | Obtiene todas las evaluaciones asociadas a un paciente    |
| POST            | api/assessments                     | Registra una nueva evaluación                             |
| PUT             | api/assessments/:id                 | Edita una evaluación                                      |
| PUT             | api/assessments/:id/soft-delete     | Marca la evaluación como eliminada (borrado lógico)       |

###### *Auth*

| Método          | Ruta                                | Descripción                                               |
|-----------------|-------------------------------------|-----------------------------------------------------------|
| POST            | api/login                           | Autentica a un usuario (profesional)                      |

###### *Patient*

| Método          | Ruta                                | Descripción                                               |
|-----------------|-------------------------------------|-----------------------------------------------------------|
| GET             | api/patients                        | Obtiene todos los pacientes                               |
| GET             | api/patients/diagnosis              | Obtiene todos los paciente en período diagnóstico         |
| GET             | api/patients/treatment              | Obtiene todos los pacientes en tratamiento                |
| GET             | api/patients/discharged             | Obtiene todos los pacientes dados de alta                 |
| GET             | api/patients/updated                | Obtiene los últimos pacientes actualizados                |
| GET             | api/patients/recently               | Obtiene los últimos pacientes creados                     |
| GET             | api/patients/:id                    | Obtiene un paciente por su id                             |
| GET             | api/search/:searchText              | Obtiene los pacientes por su nombre                       |
| POST            | api/patients                        | Registra un nuevo paciente                                |
| PUT             | api/patients/:id                    | Edita un paciente                                         |
| PUT             | api/patients/:id/soft-delete        | Marca al paciente como eliminado (borrado lógico)         |

###### *Profesional*

| Método          | Ruta                                | Descripción                                               |
|-----------------|-------------------------------------|-----------------------------------------------------------|
| GET             | api/profesional/:id                 | Obtiene al profesional por su id                          |
| GET             | api/profesional/usuario/:idUsuario  | Obtiene el id de usuario asociado al profesional          |
| POST            | api/profesional                     | Registra un nuevo profesional                             |
| PUT             | api/profesional/:id                 | Edita un profesional                                      |
| PUT             | api/profesional/:id/soft-delete     | Marca al profesional como eliminado (borrado lógico)      |

###### *Report*

| Método          | Ruta                                | Descripción                                               |
|-----------------|-------------------------------------|-----------------------------------------------------------|
| GET             | api/patients/:id/reports            | Obtiene todos los reportes asociados a un paciente        |
| POST            | api/reports                         | Registra un nuevo reporte                                 |
| PUT             | api/reports/:id                     | Edita un reporte                                          |
| PUT             | api/reports/:id/soft-delete         | Marca el reporte como eliminado (borrado lógico)          |

###### *Session*

| Método          | Ruta                                | Descripción                                               |
|-----------------|-------------------------------------|-----------------------------------------------------------|
| GET             | api/patients/:id/sessions           | Obtiene todas las sesiones asociadas a un paciente        |
| GET             | api/sessions/:patientId/last        | Obtiene la última sesión asociada al paciente             |
| POST            | api/sessions                        | Registra una nueva sesión                                 |
| PUT             | api/sessions/:sessionId             | Edita una sesión                                          |
| PUT             | api/sessions/:sessionId/soft-delete | Marca la sesión como eliminada (borrado lógico)           |

###### *User*

| Método          | Ruta                                | Descripción                                               |
|-----------------|-------------------------------------|-----------------------------------------------------------|
| POST            | api/signup                          | Crea la cuenta de usuario                                 |
| POST            | api/verify-email                    | Verifica si el usuario esta registrado                    |
| PUT             | api/password/reset                  | Resetea la contraseña                                     |
| PUT             | api/password/update                 | Actualiza la contraseña                                   |

#### Utils

##### **authToken**: maneja toda la lógica relacionada con tokens JWT para el sistema de autenticación, encapsulando las operaciones de generación y verificación de tokens.

###### **generateToken**: 
    
- Payload: recibe un objeto con datos del usuario.
- Firma: usa la clave secreta del entorno (JWT_SECRET).
- Expiración: configuración automática de 1 hora de validez.
- Salida: retorna un token JWT firmado.

###### **verifyToken**:

- Validación: verifica firma y expiración.
- Seguridad: manejo de errores para tokens inválidos.
- Salida: devuelve el payload decodificado o lanza error.

Luego de iniciada la sesión se genera un token que permite acceder al resto de los endpoints.
Las evaluaciones, reportes, sesiones y pacientes que se muestran en cada enpoint están asociados al id del profesional que inicio sesión.

***Implementación de softDelete (Borrado lógico)***

    Justificación:
        - Requerimientos legales: las historias clínicas debe ser conservadas durante el plazo de 10 años (normativa vigente en el aréa de la salud).
        - Ventajas operativas: permite que la recuperación de datos eliminados sea ágil y la realización de auditorias completas de los registros.

#### *Dependencias*

    Core
    - Node.js (Entorno de ejecución JavaScript)
    - Express 5 - Framework web para Node.js
    - ECMAScript Modules (ESM) - Sintaxis de módulos modernos ("type": "module")

    Base de Datos
    - @supabase/supabase-js v2 - Cliente oficial para Supabase (PostgreSQL)
    - pg - Controlador PostgreSQL para conexiones directas

    Seguridad y Autenticación
    - bcrypt - Hash seguro de contraseñas
    - express-jwt - Middleware para validar JWT
    - jwks-rsa - Integración con autenticación RSA (para proveedores como Auth0)
    - express-session - Manejo de sesiones del servidor

    Utilidades
    - cors - Middleware para habilitar CORS
    - dotenv - Manejo de variables de entorno (.env)
    - multer - Procesamiento de uploads de archivos

    Herramientas de Desarrollo
    - nodemon (Dev Dependency) - Reinicio automático del servidor durante desarrollo.

### **Base de Datos**

La base de datos está diseñada bajo un esquema relacional en PostgreSQL, alojada en Supabase.

* Estructura: Organizada por entidades principales con relaciones definidas.
* Consultas: Implementadas en el backend separadas por entidad.

#### Diagrama

Representación visual del modelo ER.

    URL al diagrama E-R: https://drive.google.com/drive/folders/1Uxnf4bZt2xStxRo9mF-YlbWDNdKcjF69

#### Tablas

##### **usuario**:

| Campo	    | Tipo PostgreSQL       | Tipo JavaScript	 | Descripción                                  |
|-----------|-----------------------|--------------------|----------------------------------------------|
|id	        | bigint	            | number	         | Identificador único (PK, autoincremental)    |
|usuario	| character varying     | string	         | Nombre de usuario                            |
|email	    | character varying	    | string	         | Correo electrónico (único)                   |
|password	| character varying	    | string	         | Contraseña (hash)                            |
|updated_at	| timestamp	            | string             | Fecha de última actualización                |

*Consultas Implementadas (Backend)*

* verifyRegisteredEmailQuery(email)

    - Comprueba si un email ya está registrado.
    - Equivalente a:

        SELECT * FROM usuario WHERE email = $1;

* createUserQuery(usuario, email, password)

    - Registra un nuevo usuario en la base de datos.
    - Equivalente a:

        INSERT INTO usuario (usuario, email, password) 
        VALUES ($1, $2, $3);

* updatePasswordQuery(email, newHashedPassword)

    - Cambia la contraseña de un usuario y actualiza la marca de tiempo.
    - Equivalente a:

        UPDATE usuario
        SET password = $1, updated_at = NOW()
        WHERE email = $2;

##### **profesional**

| Campo	                | Tipo PostgreSQL      | Tipo JavaScript | Descripción                                  |
|-----------------------|----------------------|-----------------|----------------------------------------------|
| id    	            | bigint	           | number	         | PK                                           |
| id_usuario	        | bigint               | number	         | FK a usuario.id                              |
| email	                | character varying	   | string	         | Contacto profesional                         |
| nombre_completo       | character varying	   | string	         | Nombre completo                              |
| especialidad	        | character varying	   | string	         | Psicologó/a - Psicopedagogo/a                |
| matricula	            | bigint	           | number	         | Número único de matrícula                    |
| genero	            | profesional_genero   | string	         | Enum: 'masculino', 'femenino', 'otro'        |
| dias_atencion	        | character varying	   | string	         | Ej: "Lunes,Martes"                           |
| horarios_atencion	    | character varying	   | string	         | Ej: "09:00-12:00"                            |
| fecha_nacimiento	    | date	               | string	         | Formato: YYYY-MM-DD                          |
| deleted_at	        | timestamp	           | string	         | Soft delete (null si activo)                 |
| fecha_actualizacion	| timestamp	           | string	         | Última modificación                          |

*Consultas Implementadas (Backend)*

* getProfesionalProfileQuery(id_usuario)

    - Obtiene el perfil del profesional.
    - Equivalente a:

        SELECT id, nombre_completo, especialidad, matricula, telefono, email, dias_atencion, horarios_atencion, genero
        FROM profesional
        WHERE id_usuario = $1 AND deleted_at IS NULL;

* createProfesionalQuery(profesional)

    - Crea al profesional.

* updateProfesionalProfileQuery(idProfesional, nuevoEmail, nuevoNombre, nuevaFecha, nuevaEspecialidad,
    nuevaEdad, nuevaMatricula, nuevoTelefono, nuevoGenero, nuevosDias, nuevosHorarios)

    - Actualiza el perfil del profesional

* softDeleteProfesionalQuery(id)

    - "Elimina" al profesional
    - Equivalente a:

        UPDATE profesional
        SET deleted_at = NOW()
        WHERE id = $1;

##### **paciente**

| Campo	                | Tipo PostgreSQL       | Tipo JavaScript	 | Descripción                                  |
|-----------------------|-----------------------|--------------------|----------------------------------------------|
| id	                | bigint	            | number	         | PK (autoincremental)                         |
| id_profesional        | bigint	            | number	         | FK a profesional.id                          |
| nombre_completo       | character varying	    | string	         | Nombre completo del paciente                 |
| fecha_nacimiento	    | date	                | string	         | Formato: YYYY-MM-DD                          |
| edad	                | bigint	            | number	         | Edad calculada                               |
| direccion	            | character varying	    | string	         | Dirección física                             |
| telefono	            | character varying	    | string	         | Teléfono de contacto                         |
| email	                | character varying	    | string	         | Correo electrónico                           |
| fecha_inicio	        | date	                | string	         | Fecha de inicio de tratamiento               |
| fecha_fin	            | date	                | string	         | Fecha de alta/finalización                   |
| motivo_inicial        | character varying	    | string	         | Razón inicial de consulta                    |
| motivo_alta	        | character varying	    | string	         | Razón del alta                               |
| sesiones_realizadas	| bigint	            | number	         | Número de sesiones completadas               |
| sesiones_totales	    | bigint	            | number	         | Total de sesiones planeadas                  |
| observaciones	        | character varying	    | string	         | Notas adicionales                            |
| fecha_actualizacion	| date	                | string	         | Última actualización del registro            |
| genero	            | paciente_genero	    | string	         | Enum: 'masculino', 'femenino', 'otro'        |
| estado	            | paciente_estado	    | string	         | Enum: 'diagnostico', 'tratamiento', 'alta'   |
| deleted_at	        | timestamp	            | string	         | Soft delete (null si activo)                 |

*Consultas Implementadas (Backend)*

* createPatientQuery(patient)

    - Crea un paciente

* getPatientProfileQuery(id, idProfesional)

    - Obtiene el perfil del paciente.
    - Equivalente a:

        SELECT * FROM paciente
        WHERE id = $1 AND id_profesional = $2 AND deleted_at IS NULL;

* getAllPatientsQuery(idProfesional)

    - Listar todos los pacientes de un profesional.
    - Equivalente a:

        SELECT * FROM paciente
        WHERE id_profesional = $1 AND deleted_at IS NULL;

* getFilteredPatientsByStateQuery(idProfesional, estado)

    - Filtra pacientes por su estado (diagnóstico, tratamiento o alta).
    - Equivalente a:

        SELECT * FROM paciente
        WHERE id_profesional = $1 AND estado = $2 AND deleted_at IS NULL
        ORDER BY id DESC;

* getPatientsByNameQuery(searchText)

    - Busca por nombre.
    - Equivalente a:

        SELECT id, nombre_completo FROM paciente
        WHERE nombre_completo ILIKE '%' || $1 || '%' AND deleted_at IS NULL;

* getLatestCreatedPatientsQuery(idProfesional)

    - Obtiene los últimos pacientes creados.
    - Equivale a:

        SELECT * FROM paciente
        WHERE id_profesional = $1
        ORDER BY id DESC
        LIMIT 3;

* getRecentlyUpdatedPatientsQuery(idProfesional)

    - Obtener los pacientes recientemente actualizados.
    - Equivale a:

        SELECT * FROM paciente
        WHERE id_profesional = $1 AND fecha_actualizacion IS NOT NULL
        ORDER BY fecha_actualizacion DESC
        LIMIT 3;

* updatePatientQuery(id_paciente, id_profesional, params)

    - Actualiza los datos del paciente.

* softDeletePatientQuery(id, id_profesional)

    - "Elimina" al paciente.
    - Equivale a:

        UPDATE paciente
        SET deleted_at = NOW()
        WHERE id = $1 AND id_profesional = $2;

##### **evaluacion**

| Campo	                | Tipo PostgreSQL              | Tipo JavaScript	 | Descripción                                  |
|-----------------------|------------------------------|---------------------|----------------------------------------------|
| id	                | bigint	                   | number	             | PK (autoincremental)                         |
| id_profesional	    | bigint	                   | number	             | FK a profesional.id                          |
| id_paciente	        | bigint	                   | number	             | FK a paciente.id                             |
| fecha_evaluacion	    | date	                       | string	             | Fecha de la evaluación (YYYY-MM-DD)          |
| nombre_evaluacion	    | character varying	           | string	             | Nombre descriptivo de la evaluación          |
| resultado	            | character varying	           | string	             | Resultados principales                       |
| observaciones	        | character varying	           | string	             | Notas adicionales                            |
| tipo_evaluacion	    | evaluacion_tipoEvaluacion	   | string	             | Tipo enumerado (ej: 'inicial', 'seguimiento')|
| fecha_actualizacion	| timestamp without time zone  | string	             | Última modificación                          |
| deleted_at	        | timestamp without time zone  | string	             | Soft delete (null si activo)                 |

*Consultas Implementadas (Backend)*

* logAssessmentQuery(assessment)

    - Crea una evaluación.
    - Equivalente a: 

        INSERT INTO evaluacion ( fecha_evaluacion, nombre_evaluacion, tipo_evaluacion, resultado, observaciones, 
        id_profesional, id_paciente) VALUES ($1, $2, $3, $4, $5, $6, $7);

* getAssessmentsQuery(idProfesional)

    - Obtiene las evaluaciones de un profesional (con JOIN a paciente).
    - Equivale a:

        SELECT 
            e.id, e.nombre_evaluacion, e.fecha_evaluacion,
            e.id_paciente, e.resultado, e.observaciones, e.tipo_evaluacion,
            p.nombre_completo AS paciente_nombre
        FROM evaluacion e
        JOIN paciente p ON e.id_paciente = p.id
        WHERE e.id_profesional = $1 AND e.deleted_at IS NULL
        ORDER BY e.fecha_evaluacion DESC;

* getAssessmentByPatientQuery(idProfesional, idPatient)

    - Obtiene evaluaciones por paciente.
    - Equivale a:

        SELECT * FROM evaluacion
        WHERE id_profesional = $1 AND id_paciente = $2 AND deleted_at IS NULL;

* updateAssessmentQuery(idProfesional, id_evaluacion, actualizoResultado, nuevasObservaciones)

    - Actualiza las evaluaciones del paciente.
    - Equivale a:

        UPDATE evaluacion
        SET 
        resultado = $1,
        observaciones = $2,
        fecha_actualizacion = NOW()
        WHERE id = $3 AND id_profesional = $4
        RETURNING *;

* softDeleteAssessmentQuery(idEvaluacion)

    - "Elimina" la evaluación.
    - Equivale a:

        UPDATE evaluacion
        SET deleted_at = NOW()
        WHERE id = $1;

##### **reporte**

| Campo	                | Tipo PostgreSQL              | Tipo JavaScript	 | Descripción                                  |
|-----------------------|------------------------------|---------------------|----------------------------------------------|
| id	                | bigint	                   | number	             | PK (autoincremental)                         |
| id_paciente	        | bigint	                   | number	             | FK a paciente.id                             |
| id_evaluacion	        | bigint	                   | number	             | FK a evaluacion.id                           |
| fecha_reporte	        | date	                       | string	             | Fecha de creación del reporte                |
| descripcion	        | character varying	           | string	             | Detalles del reporte                         |
| archivo	            | character varying	           | string	             | Ruta/nombre del archivo adjunto              |
| tipo_reporte	        | reporte_tipoReporte	       | string	             | Tipo enumerado (ej: 'informe', 'resultados') |
| deleted_at	        | timestamp without time zone  | string	             | Soft delete (null si activo)                 |
| fecha_actualizacion	| timestamp without time zone  | string	             | Última modificación                          |

*Consultas Implementadas (Backend)*

* logReportQuery(tipo_reporte, fecha_reporte, descripcion, archivo, id_evaluacion, id_paciente)

    - Crea un reporte
    - Equivale a:

        INSERT INTO reporte (
        tipo_reporte, fecha_reporte, descripcion,
        archivo, id_evaluacion, id_paciente
        ) VALUES ($1, $2, $3, $4, $5, $6);

    - Validaciones:

        - Campos obligatorios: tipo_reporte, fecha_reporte, archivo.
        - id_evaluacion e id_paciente deben ser números válidos.

* getReportByIdQuery(idReport)

    - Obtiene un reporte por ID
    - Equivale a:

            SELECT * FROM reporte
            WHERE id = $1 AND deleted_at IS NULL;

* getReportsByPatientIdQuery(idPatient)

    - Obtiene reportes por paciente (con JOIN a Evaluación).
    - Equivale a:

        SELECT 
            r.id, r.fecha_reporte, r.descripcion, r.archivo, r.tipo_reporte,
            e.nombre_evaluacion
        FROM reporte r
        JOIN evaluacion e ON r.id_evaluacion = e.id
        WHERE r.id_paciente = $1 AND r.deleted_at IS NULL
        ORDER BY r.fecha_reporte DESC;

* updateReportQuery(idReporte, nuevaFecha, nuevaDescripcion, nuevoArchivo, nuevoTipo)

    - Actualiza un reporte.
    - Equivale a:

        UPDATE reporte
        SET 
        fecha_reporte = $1,
        descripcion = $2,
        archivo = $3,
        tipo_reporte = $4,
        fecha_actualizacion = NOW()
        WHERE id = $5;

* softDeleteReportQuery(idReport)

    - "Elimina" un reporte.
    - Equivale a:

        UPDATE reporte
        SET deleted_at = NOW()
        WHERE id = $1;

##### **sesion**

| Campo	                | Tipo PostgreSQL              | Tipo JavaScript	 | Descripción                                  |
|-----------------------|------------------------------|---------------------|----------------------------------------------|
|id	                    | bigint	                   | number	             | PK (autoincremental)                         |
|id_profesional	        | bigint	                   | number	             | FK a profesional.id                          |
|id_paciente	        | bigint	                   | number	             | FK a paciente.id                             |
|fecha	                | date	                       | string	             | Fecha de la sesión (YYYY-MM-DD)              |
|hora	                | time without time zone	   | string	             | Hora de inicio (HH:MM:SS)                    |
|duracion	            | character varying	           | string	             | Duración (ej: "60 minutos")                  |
|observaciones	        | character varying	           | string	             | Notas adicionales                            |
|tipo_sesion	        | sesion_tipoSesion	           | string	             | Tipo enumerado (ej: 'terapia', 'evaluación') |
|estado	                | sesion_estado	               | string	             | Estado (ej: 'programada', 'completada')      |
|deleted_at	            | timestamp without time zone  | string	             | Soft delete (null si activa)                 |
|fecha_actualizacion	| timestamp without time zone  | string	             | Última modificación                          |

*Consultas Implementadas (Backend)*

* logSessionQuery(fecha, hora, duracion, estado, tipo_sesion, observaciones, id_profesional, id_paciente)

    - Crea una sesión.
    - Equivale a:

        INSERT INTO sesion (
        fecha, hora, duracion, estado,
        tipo_sesion, observaciones, id_profesional, id_paciente
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);


* getSessionById(idSession, idProfesional)

    - Obtiene una sesión por su ID.
    - Equivale a:

        SELECT * FROM sesion
        WHERE id = $1 AND id_profesional = $2 AND deleted_at IS NULL;

* getSessionsByPatientIdQuery(idPatient, idProfesional)

    - Obtiene sesiones por paciente.
    - Equivale a:
        SELECT * FROM sesion
        WHERE id_paciente = $1 AND id_profesional = $2 AND deleted_at IS NULL;

* getLastSessionForPatientQuery(idPatient, idProfesional)

    - Obtiene la última sesión de un paciente.
    - Equivale a:

        SELECT * FROM sesion
        WHERE id_paciente = $1 AND id_profesional = $2 AND deleted_at IS NULL
        ORDER BY fecha DESC
        LIMIT 1;

* updateSessionQuery(idSession, idProfesional, nuevaFecha, nuevaHora, nuevaDuracion, nuevotTipo, nuevoEstado, nuevasObservaciones)

    - Actualiza la sesión.
    - Equivale a:

        UPDATE sesion
        SET 
            fecha = $1,
            hora = $2,
            duracion = $3,
            tipo_sesion = $4,
            estado = $5,
            observaciones = $6,
            fecha_actualizacion = NOW()
        WHERE id = $7 AND id_profesional = $8;

* softDeleteSessionQuery(idSession, idProfesional)

    - "Elimina" una sesión.
    - Equivale a:

        UPDATE sesion
        SET deleted_at = NOW()
        WHERE id = $1 AND id_profesional = $2;

### **Variables de entorno**

    Por razones de seguridad serán enviadas de manera privada.

### **Despliegue**
    
URL pública: https://cognicare-frontend.vercel.app/ 
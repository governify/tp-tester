# Bluejay - TP Tester
Este proyecto es una extensión de Bluejay. La documentación oficial de Bluejay se puede encontrar en: [docs.bluejay.governify.io](https://docs.bluejay.governify.io/). Siendo una extensión de Bluejay, es esencial para el funcionamiento completo de Bluejay-Tester.

# Índice
- [Bluejay - TP Tester](#bluejay---tp-tester)
  - [Introducción](#introducción)
    - [¿Qué es Bluejay?](#qué-es-bluejay)
    - [¿Cuál es el propósito de Bluejay-TP Tester?](#cuál-es-el-propósito-de-bluejay-tp-tester)
  - [Cómo empezar](#cómo-empezar)
    - [Modo de desarrollo](#modo-de-desarrollo)
    - [Con Docker](#con-docker)
- [Gestión de TPA](#gestión-de-tpa)
  - [Página de TPA](#página-de-tpa)
  - [Edición de TPA](#edición-de-tpa)
- [Métricas](#métricas)
  - [Cargador de Métricas](#cargador-de-métricas)
  - [Visor de Métricas](#visor-de-métricas)
  - [Ejecutor de Métricas](#ejecutor-de-métricas)
- [Página de Pruebas Manuales](#página-de-pruebas-manuales)
  - [Clonar Nuevo Repositorio](#clonar-nuevo-repositorio)
  - [Repositorio Clonado](#repositorio-clonado)
- [Pruebas Automatizadas](#pruebas-automatizadas)
  - [Estructura de la Página](#estructura-de-la-página)
  - [Carga de Archivos YAML](#carga-de-archivos-yaml)
  - [Ejecución de Pruebas](#ejecución-de-pruebas)
  - [Visualización de Resultados](#visualización-de-resultados)
  - [Resultados de las Pruebas](#resultados-de-las-pruebas)
  - [Variables a Utilizar](#variables-a-utilizar)
    - [actualTime](#actualtime)
    - [value](#value)
    - [minExpectedValue](#minexpectedvalue)
    - [maxExpectedValue](#maxexpectedvalue)
    - [expectedValue](#expectedvalue)
- [Página de Configuración](#página-de-configuración)
  - [Obtener Token de Github](#obtener-token-de-github)
  - [Documentación de la API Swagger](#documentación-de-la-api-swagger)
  - [Traducciones](#traducciones)

## Introducción
### ¿Qué es Bluejay?
Bluejay Infrastructure es una infraestructura basada en Governify que permite auditar fácilmente a los equipos ágiles. Está compuesta por un subconjunto de microservicios de Governify que se pueden desplegar en una sola máquina o en un clúster. Bluejay accede a múltiples fuentes para recopilar información sobre los equipos de desarrollo, como GitLab, Jira, Slack, etc., y utiliza esta información para verificar si estos equipos cumplen con un Acuerdo de Prácticas de Equipo (TPA) que incluye métricas y garantías relacionadas con la metodología ágil.

### ¿Cuál es el propósito de Bluejay-TP Tester?
El propósito de este TP-Tester es, como su nombre indica, primero probar las métricas que componen los TP (Prácticas de Equipo). Una vez que se ha verificado que estas métricas funcionan correctamente, TP-Tester permite comprobar que todo el TPA (Acuerdo de Prácticas de Equipo) funciona correctamente. Para ello, puedes añadir, eliminar o modificar TPAs que están directamente en Bluejay desde este TP Tester.
## Cómo empezar
### Modo de desarrollo
Para levantar Bluejay-TP Tester en modo de desarrollo, sigue estos pasos:
1. Clona el repositorio de Bluejay-TP Tester.
2. Instala las dependencias con `npm install`.
3. Levanta el proyecto con `npm start`.

Esto sería suficiente ya que el proyecto usa concurrently y levanta tanto el servidor express como angular al mismo tiempo. El servidor Express (API de GlassMatrix) se levanta en el puerto 6012 y la aplicación Angular en el puerto 4200.

### Con Docker
Para levantar Bluejay-TP Tester con docker, sigue estos pasos:
1. Clona el repositorio de Bluejay-TP Tester.
2. Instala las dependencias con `npm install`.
3. Ejecuta `npm run docker`.

Con esto, tendríamos el proyecto levantado en el puerto 6011 la web angular, y el servidor express en el puerto 6012.
# Gestión de TPA
# PÁGINA DE TPA
La página de gestión de TPA permite visualizar e interactuar con aquellos TPAs que están dentro de Bluejay.

### TPAs existentes

Esta sección muestra una tabla de todos los TPAs existentes. Cada fila de la tabla representa un solo TPA, mostrando su ID, proyecto y clase.

También hay varios botones de acción para cada TPA:

- El botón **Copiar** permite copiar el contenido de un TPA en el área de texto inferior.
- El botón **Ver** navega a una vista detallada del TPA.
- El botón **Editar** navega a una página donde puedes editar el TPA.
- El botón **Eliminar** elimina el TPA de la base de datos de Bluejay.

### Crear TPA

Esta sección permite crear un nuevo TPA. Proporciona un área de texto donde puedes introducir el contenido del nuevo TPA.

Hay dos botones:

- El botón **Crear TPA** crea un nuevo TPA con el contenido que has introducido en el área de texto.
- El botón **Copiar TPA por defecto** llena el área de texto con el contenido de un TPA por defecto, que luego puedes modificar y crear como un nuevo TPA.

## Edición de TPA

Cuando haces clic en el botón de edición de un TPA, entrarás en una subpágina que te dará acceso a otras dos subpáginas.

- Una donde puedes editar todo el TPA.
- Y otra donde puedes editar el TPA por secciones.
### EDITAR TPA COMPLETO
Aquí podrás editar el contenido del TPA en un área de texto con el contenido actual del TPA y un botón de guardar que actualizará ese contenido

### EDITAR TPA POR SECCIONES
En esta página puedes editar el TPA por secciones, editando o eliminando cada métrica y garantía del TPA. Y también puedes añadir nuevas métricas y garantías. Si seleccionas el botón "más", generará una métrica individual para que la revises y pruebes, y te redirigirá a la nueva página con esa métrica creada.

![TPA Sections.png](src/assets/images/tpaSectionEdit.png)

# Métricas

La página de Carga de Métricas está diseñada para gestionar y probar las métricas. Proporciona una interfaz de usuario amigable para visualizar, crear y gestionar métricas.

### Métricas existentes
Aquí puedes ver todas las métricas guardadas, clasificadas en dos grandes tablas. Una tabla consta de aquellas guardadas desde la sección de TPA, que estarán relacionadas con el TPA al que pertenecían. La otra tabla contiene métricas individuales guardadas, que no están relacionadas con ningún TPA específico.

Cada fila de la tabla representa una única métrica, mostrando su nombre y proporcionando botones de acción:
- El botón **Ver** navega a una vista detallada de la métrica.
- El botón **Ejecutar/Editar** navega a una página donde puedes ejecutar o editar la métrica.
- El botón **Eliminar** elimina la métrica.

### Crear nueva métrica
Esta sección permite crear una nueva métrica. Proporciona un área de texto donde puedes introducir el contenido de la nueva métrica.

Hay dos botones:
- El botón **Publicar** publica el contenido que has introducido en el área de texto en la API de Bluejay para su cálculo.
- El botón **Obtener Cálculo** recupera los resultados del cálculo de la API de Bluejay.

![img.png](src/assets/images/metric-computation.png)

En esta sección, también puedes ver un tutorial que te guiará a través del proceso de creación de una nueva métrica. Además, puedes guardar tu métrica como un archivo JSON.

## Visor de Métricas
La página del Visor de Métricas te permite ver los detalles de una métrica específica. Muestra la representación JSON actual de la métrica.

## Ejecutor de Métricas
La página del Ejecutor de Métricas te permite ejecutar una métrica específica. Proporciona una interfaz de usuario amigable para ver y modificar los detalles de la métrica, y para ejecutar la métrica.

![img.png](src/assets/images/metric-execution.png)
### Detalles de la Métrica
Esta sección muestra los detalles de la métrica. Proporciona varios campos de entrada donde puedes modificar los detalles de la métrica:

- El campo **Proyectos** te permite especificar el proyecto asociado a la métrica.
- El campo **Clase** te permite especificar la clase asociada a la métrica.
- El campo **Periodo** te permite especificar el periodo para la métrica.

### Búsqueda de Cálculos

Esta sección te permite especificar los parámetros para el cálculo de la métrica. Proporciona varios campos de entrada:

- El campo **Tipo** te permite especificar el tipo de cálculo.
- El campo **Periodo** te permite especificar el periodo para el cálculo.
- El campo **Inicial** te permite especificar la fecha inicial para el cálculo.
- El campo **Desde** te permite especificar la fecha de inicio para el cálculo.
- El campo **Hasta** te permite especificar la fecha de finalización para el cálculo.
- El campo **Zona horaria** te permite especificar la zona horaria para el cálculo.

También hay varios botones:  
- El botón **Establecer a la hora actual** establece los parámetros de cálculo a la hora actual.
- El botón **Guardar como JSON** guarda la métrica y sus detalles como un archivo JSON.
- El botón **Tutorial** abre un diálogo de tutorial.

### Sección de Ejecución
Esta sección te permite ejecutar la métrica. Proporciona un área de texto donde puedes ver la representación JSON de la métrica.  
También hay varios botones:
- El botón **Publicar** envía la métrica a la API de Bluejay para su cálculo.
- El botón **Obtener Cálculo** recupera los resultados del cálculo de la API de Bluejay.

# Página de Pruebas Manuales

La página de Pruebas Manuales proporciona una interfaz amigable para probar la funcionalidad de la aplicación. Ofrece dos opciones principales: crear un nuevo repositorio o trabajar con un repositorio clonado.

![img.png](src/assets/images/img.png)
## Clonar Nuevo Repositorio

Aquí puedes ver todos los repositorios a los que tiene acceso el token introducido.

Cada repositorio también tendrá dos botones: el botón "Ver", que te redirigirá a la página de GitHub del repositorio, y el botón "Editar", que te llevará a la página de clonación.

### Página de Clonación

La página de Clonación te permite clonar un repositorio específico. Muestra los detalles del repositorio, incluyendo su nombre, descripción, propietario, tiempo de creación, tiempo de actualización, lenguaje, visibilidad, y una lista de todas las ramas. También proporciona un botón para clonar el repositorio.

## Repositorio Clonado

Esta sección te permite trabajar con un repositorio clonado. Proporciona una breve descripción del proceso y un botón para comenzar a trabajar con el repositorio clonado.

![img_1.png](src/assets/images/clonedRepos.png)

### Página de Ramas

La página te permite gestionar las ramas de un repositorio. Ofrece opciones para ver las ramas, crear una nueva rama, eliminar una rama, y cambiar la rama actual.

### Página de Pull Requests

La página de Pull Requests proporciona una interfaz amigable para gestionar las pull requests de un repositorio. Ofrece opciones para crear una nueva pull request, ver las pull requests abiertas, y fusionar una pull request.

### Página de Acciones

La página de Acciones es una interfaz para gestionar un repositorio. Ofrece opciones para ver las ramas disponibles, cambiar la rama actual, crear un nuevo archivo, crear un nuevo commit, empujar cambios, ver archivos en el repositorio, y gestionar problemas.

# Pruebas Automatizadas
- [Carga de Archivos YAML](#yaml-file-loading)
- [Ejecución de Pruebas](#test-execution)
  - [Métodos GET](#get-methods)
  - [Métodos POST](#post-methods)
  - [Métodos PUT](#put-methods)
  - [Métodos DELETE](#delete-methods)
  - [Métodos TEST](#test-methods)
- [Visualización de Resultados](#results-visualization)
- [Resultados de las Pruebas](#test-results)
- [Variables a Utilizar](#variables-to-use)
  - [actualTime](#actualtime)
  - [value](#value)
  - [minExpectedValue](#minexpectedvalue)
  - [maxExpectedValue](#maxexpectedvalue)
  - [expectedValue](#expectedvalue)

## Estructura de la Página
Esta página es una interfaz de usuario para ejecutar y probar scripts. Estos scripts tendrán un formato .yaml, e interactuarán con la API de GitHub y los Repositorios para probar métricas ya creadas. La página se divide en varias secciones:

## Carga de Archivos YAML
En la parte superior de la página, hay una tabla que muestra todos los archivos YAML disponibles. Los usuarios pueden copiar el contenido del archivo, ver el archivo, editar el archivo, o eliminar el archivo.

## Ejecución de Pruebas
En la sección de ejecución, los usuarios pueden introducir el nombre del archivo YAML que quieren ejecutar. También pueden guardar el contenido actual del cuadro de texto (debe seguir el formato de ejemplo y las llamadas se ejecutarán secuencialmente),

Los usuarios podrán seguir una serie de "pasos". Los "pasos" son acciones que se pueden realizar en el sistema. Estos pasos están predefinidos y realizan métodos HTTP (como 'GET', 'POST', 'PUT', 'DELETE') a las acciones correspondientes. Aquí están los posibles pasos:

1. Métodos GET
- `github/getIssue`: Este paso obtiene los problemas de un repositorio específico en GitHub.
- `github/getOpenPR`: Este paso obtiene las pull requests abiertas de un repositorio específico en GitHub.
- `github/pullCurrentBranch`: Este paso realiza un pull de la rama actual en un repositorio específico.
- `github/listRepos`: Este paso lista todos los repositorios.
- `github/getBranches`: Este paso obtiene todas las ramas de un repositorio específico.
- `github/getRepoInfo`: Este paso obtiene información sobre un repositorio específico y una rama específica.

2. Métodos POST
- `github/mergeLastOpenPR`: Este paso fusiona la última pull request abierta en un repositorio específico en GitHub.
- `bluejay/compute/tpa`: Este paso carga los datos de un archivo y luego realiza un cálculo sobre los datos.
- `bluejay/compute/metric`: Este paso carga los datos de un archivo y luego realiza un cálculo sobre los datos.
- `bluejay/checkContain`: Este paso (que está marcado como obsoleto) comprueba si un valor específico está presente en los datos obtenidos de una API.
- `github/createIssue`: Este paso crea un nuevo problema en un repositorio específico en GitHub.
- `github/createPR`: Este paso crea una nueva pull request en un repositorio específico en GitHub.
- `github/cloneRepo`: Este paso clona un repositorio específico.
- `github/createBranch`: Este paso crea una nueva rama en un repositorio específico.
- `github/createFile`: Este paso crea un nuevo archivo en un repositorio específico.
- `github/createCommit`: Este paso crea un nuevo commit en un repositorio específico.
- `github/commitAllChanges`: Este paso hace commit de todos los cambios en un repositorio específico.
- `github/pushChanges`: Este paso empuja todos los cambios en un repositorio específico.

3. Métodos PUT
- `github/mergePR`: Este paso fusiona una pull request específica en un repositorio específico en GitHub.
- `github/changeBranch`: Este paso cambia a una rama específica en un repositorio específico.

4. Métodos DELETE
- `github/deleteRepo`: Este paso elimina un repositorio específico.
- `github/deleteBranch`: Este paso elimina una rama específica de un repositorio.
- `github/deleteFile`: Este paso elimina un archivo específico de un repositorio.

5. Métodos TEST
- `bluejay/check`: Este paso realiza una serie de comprobaciones sobre los datos obtenidos de una API. Comprueba si el valor de una clave específica cumple ciertas condiciones (como un valor mínimo esperado, un valor máximo esperado, o un valor exacto esperado).
- `bluejay/findCheck`: Este paso es similar a `bluejay/check` pero tiene un formato diferente que te permite comprobar más campos a la vez.
  Cada paso se ejecuta en base a los datos proporcionados en el cuadro de texto que se está procesando.

## Visualización de Resultados
Después de ejecutar el bloque de pruebas, los resultados se muestran en un área de texto de solo lectura. Si el script realizó un cálculo, los resultados de ese cálculo también se muestran en un área de texto de solo lectura.

## Resultados de las Pruebas
En la columna derecha de la página, los usuarios pueden ver los resultados de las pruebas que se han ejecutado. Cada resultado de la prueba se muestra en su propia tarjeta, y los usuarios pueden eliminar los resultados de las pruebas individuales.

![img.png](src/assets/images/testResult.png)

## Variables a Utilizar
### actualTime
Para calcular la métrica con la hora actual, debes añadir actualTime: "true" al método "bluejay/compute/metric". Si, por otro lado, quieres que utilice la hora original de la métrica, puedes eliminar "actualTime" o establecerlo en "false".

```yaml
steps:
  - uses: "bluejay/compute/metric"
    with:
      collector: "EVENTS"
      metric: "additions_metric.json"
      actualTime: "true"
    method: "POST"
  - uses: "bluejay/check"
    with:
      - key: "additions"
        conditions:
          expectedValue: "49"
    method: "TEST"
```

### value
Si hay múltiples resultados, puedes usar la métrica "value" para comprobar sólo aquellas evidencias que tienen el campo "value" en el valor establecido.

```yaml
steps:
  - uses: "bluejay/compute/metric"
    with:
      collector: "EVENTS"
      metric: "additions_metric.json"
    method: "POST"
  - uses: "bluejay/check"
    value: "1"
    with:
      - key: "additions"
        conditions:
          minExpectedValue: "5"
```

### minExpectedValue
La prueba será exitosa si hay algún campo llamado como el campo clave, en este caso "additions" cuyo valor es numérico y es mayor que 5.

```yaml
  - uses: "bluejay/check"
    value: "1"
    with:
      - key: "additions"
        conditions:
          minExpectedValue: "5"
```

### maxExpectedValue
La prueba será exitosa si hay algún campo llamado como el campo clave, en este caso "additions" cuyo valor es numérico y es menor que 12.

```yaml
  - uses: "bluejay/check"
    value: "1"
    with:
      - key: "additions"
        conditions:
          maxExpectedValue: "12"
```

### expectedValue
La prueba será exitosa si hay algún campo llamado como el campo clave, en este caso "additions" cuyo valor es numérico o no y es exactamente igual al valor esperado.

```yaml
  - uses: "bluejay/check"
    with:
      - key: "additions"
        conditions:
          expectedValue: "49"
    method: "TEST"
```

# Página de configuración
La página de configuración proporciona una interfaz amigable para gestionar la configuración de la aplicación. Ofrece opciones para ver los contenedores Docker activos, actualizar la configuración de la aplicación, ver la documentación de Swagger y ver la documentación de la aplicación.

La página se divide en varias secciones:

1. La sección Docker Active muestra una tabla de contenedores Docker activos. Cada fila de la tabla representa un contenedor Docker y proporciona información sobre el ID del contenedor, el nombre, la URL y el puerto.

2. La sección Github Token proporciona instrucciones sobre cómo obtener un token de Github. También incluye un botón para abrir un diálogo con ayuda adicional.

3. La sección Constants proporciona un formulario para actualizar la configuración de la aplicación. El formulario incluye campos para la URL base, el recolector predeterminado, la URL de los eventos del recolector, la URL de los acuerdos y la URL de los ámbitos. Hay un botón para enviar el formulario y actualizar la configuración.

4. La sección Swagger proporciona un enlace a la documentación de Swagger.

5. La sección de Documentación proporciona un visor PDF incrustado para ver la documentación de la aplicación. También hay un botón para abrir la documentación en una nueva pestaña.

## Obtener token de github
Esta es una guía paso a paso sobre cómo crear un token de acceso personal en GitHub:

1. En la esquina superior derecha de cualquier página, haz clic en tu foto de perfil, luego haz clic en Configuración.
2. En la barra lateral izquierda, haz clic en Configuración del desarrollador.
3. En la barra lateral izquierda, haz clic en Tokens de acceso personal.
4. Haz clic en Generar nuevo token.
5. En el campo "Nota", dale a tu token un nombre descriptivo.
6. Para darle a tu token una caducidad, selecciona Caducidad, luego elige una opción predeterminada o haz clic en Personalizado para ingresar una fecha.
7. Selecciona los ámbitos que te gustaría otorgar a este token. Para usar tu token para acceder a repositorios desde la línea de comandos, selecciona repo. Un token sin ámbitos asignados solo puede acceder a información pública. Para obtener más información, consulta "Ámbitos para aplicaciones OAuth".
8. Haz clic en Generar token.
9. Opcionalmente, para copiar el nuevo token a tu portapapeles, haz clic en el icono de dos cuadrados superpuestos.

Para obtener más información, visita [la documentación oficial de GitHub](https://docs.github.com/en/enterprise-server@3.9/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens).

## Documentación de la API de Swagger

Esta API implementa Swagger para tener siempre todos los puntos finales de la API en un solo lugar junto con una pequeña documentación de la operación de cada punto final. Gracias a Swagger, puedes ver todos los puntos finales y probarlos en su interfaz gráfica que está disponible en: [http://localhost:6012/api-docs/](http://localhost:6012/api-docs/)

### Ejemplos de uso

A continuación se muestran algunos ejemplos de cómo se ve la API a través de swagger donde puedes ejecutar directamente las llamadas:

<p align="center">
  <img src="src/assets/images/swagger.png" alt="Swagger" width="400">
</p>

## Traducciones

Gracias a la biblioteca ngx-translate ([github.com/ngx-translate/core](https://github.com/ngx-translate/core)). Por defecto, TP Tester estará en el idioma del navegador. Esta biblioteca también permite agregar traducciones de una manera sencilla ya que sería suficiente traducir el Json de un idioma a otro y no habría necesidad de modificar ningún otro tipo de archivo.

Este es un fragmento de cómo funciona el .json del idioma:

```json
"METRICS_LOADER": {
  "TITULO1": "Métricas guardadas",
  "TITULO2": "Crear nueva métrica",
  "MESSAGE_TEXT": "No hay métricas guardadas",
  "FILE_NAME": "Nombre del archivo",
  "VIEW_FILE": "Ver archivo",
  "EXECUTE_EDIT_FILE": "Ejecutar / Editar archivo",
  "DELETE_FILE": "Eliminar archivo",
  "VIEWER": {
    "VIEWING": "nombreDelArchivo."
  }
},
```

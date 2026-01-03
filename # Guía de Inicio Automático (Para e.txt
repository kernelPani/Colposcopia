# Guía de Inicio Automático (Para el Usuario Final)

Para que el sistema se abra solo cada vez que el Dr. encienda la computadora, sigue estos 3 simples pasos:

## Paso 1: Configurar Docker Desktop
1. Abre **Docker Desktop**.
2. Ve al icono de **Configuración** (el engrane arriba a la derecha).
3. En la pestaña **General**, asegúrate de que esté marcada la opción:  
   `[X] Start Docker Desktop when you log in`.
4. Haz clic en **Apply & Restart**.

> [!IMPORTANT]
> **¿Por qué Docker aparece vacío?**  
> En una PC nueva, los contenedores aún no existen. Docker solo reinicia cosas que ya "conoce". He actualizado el archivo `Abrir_Sistema.bat` para que él mismo le diga a Docker que cree e inicie el proyecto la primera vez.

## Paso 2: El archivo "Abrir_Sistema.bat" actualizado
He modificado el archivo `Abrir_Sistema.bat`. Ahora, además de abrir el navegador, ejecutará el comando necesario para que Docker reconozca el proyecto automáticamente.

## Paso 3: Ponerlo en la "Carpeta de Arranque" de Windows
1. Presiona las teclas `Windows + R` en tu teclado.
2. Escribe `shell:startup` y presiona **Enter**. Se abrirá una carpeta vacía.
3. Copia el archivo `Abrir_Sistema.bat` que está en la carpeta del proyecto y **pégalo** dentro de esa carpeta que se abrió.

---

### ¿Cómo funcionará ahora?
1. El Dr. enciende su computadora.
2. Windows inicia y abre Docker Desktop en segundo plano.
3. Docker detecta que el sistema médico debe estar prendido e inicia el servidor.
4. Unos segundos después, el navegador se abrirá solo en la página principal del **Sistema Médico**.

**¡Listo! El usuario final no tendrá que tocar ninguna línea de código.**

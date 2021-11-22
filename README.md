# ProyectoGC de Bruno Hae y Jesús Alcala

Museo de arte interactivo, donde la persona puede leer la descripcion de ciertas piezas (pinturas y esculturas), al igual de que podra interactuar con ellas generando un cambio o efecto en estas. Las piezas nosotros las crearemos o seleccionaremos. El modelo del museo no lo queremos hacer de un museo real, nosotros diseñaremos como es.

Ejemplos:
Museo virtual: https://www.youtube.com/watch?v=CmpGmOcXj7w&t=82s
![imagen](https://user-images.githubusercontent.com/61795705/131900296-4ac3c656-46f6-4ab1-85a2-6578f7cb4f9c.png)
![imagen](https://user-images.githubusercontent.com/61795705/131900409-2005ad3c-b226-4908-ba6e-13c322a1d175.png)


## Requerimientos funcionales 

	Movimiento y funcionalidad
	
El usuario debe poder moverse utilizando las teclas direccionales.

El usuario no podrá atravesar las paredes dentro del recorrido.

El usuario no podrá atravesar el piso.

Se le permitirá al usuario moverse libremente por el interior del museo.

El usuario podrá desplazarse por los diferentes cuartos del museo (esculturas y pinturas).

El usuario podrá interactuar con las obras.

El usuario podrá regresar al punto inicial a cualquier momento.

El usuario podrá obtener ayuda sobre las funciones y los controles que posee el recorrido.

El usuario podrá salir en cualquier momento del recorrido.

El usuario podrá dar clic sobre las obras en exposición para acceder a los datos de la obra o interactuar

El usuario no podrá mover la orientación vertical de la cámara, a fin de facilitar el movimiento y evitar confusiones.

El usuario se desplazará a una velocidad lenta para facilitar el movimiento dentro del museo.

	Hardware y Software
	
El software podrá ser utilizado en los sistemas operativos Windows, Linux y OSX.

La aplicación debe poder utilizarse sin necesidad de instalar ningún software adicional además de un navegador web.

La aplicación debe poder utilizarse con los navegadores web Chrome, Firefox e Internet Explorer.



## Tareas definidas
Nosotros pensamos trabajar de manera iterativa, avanzando en las tareas de manera continua semanalmente y, si es neceario, modificar los requerimientos para que se adapaten a lo que necesitamos. Las tareas que consideramos ahora son las siguientes:

1. Boceto del diseño del museo -Jesús

2. Digitalización del boceto del museo -Jesús, Bruno

3. Boceto del diseño de las obras -Jesús

4. Digitalización del boceto de las obras -Jesús, Bruno

5. Movilidad en el museo -Jesús, Bruno

6. Interacciones con objetos -Bruno

7. Interfaz de la aplicación web -Jesús, Bruno

8. Documentación -Bruno

### Puede que estas cambien si lo consideramos necesario


## Descripcion y librerias

La forma en la que cumplimos los requerimientos fue con el uso de librerías que nos facilitaron el desarrollo de los elementos que requerimos:

* Three.js (Uso general, vimos que es muy usado para webgl y facilitó muchas de las tareas. Construcción de la escena y cargar objetos).

* jQuery (Creemos que nos ayudara a manejar eventos, no estamos muy seguros si será necesario sobre lo que js ya ofrece, pero lo tenemos en cuenta).

* Cannon JS y PointerLockControl (Usadas para el moviemiento de la cámara y aspectos relacionados).

* Tween.js (Animaciones y cambios en las propiedades de los objetos más suaves).



## Primera entrega del proyecto 

La forma en la que el usario interactua con las estatuas y las pinturas es mediante el click a una distancia cercana. Se manejará el comportanmiento de cada pieza con estados, listeners y raycasting con el fin de que ciertos procesos no se puedan interrumpir y los comportamientos sean como nosostros los esperamos.

### Interacción con estatuas:

* Venus de Milo: Cuando el usuario le de click, Venus comienza a girar y a desplazarse hacia abajo hasta desaparecer, después comienza a desplazarse hacia arriba hasta regresar a su posición original, todo esto, con cambios de color aleatorios durante la animación.
* Perro de Origami: La estatua se comienza a mover de un lado a otro simulando a un perro "jugando" y comienza a cambiar de color de manera aleatoria para después regresar a su color y posición original.
![imagen](https://user-images.githubusercontent.com/61795705/137788187-0fc5213c-f202-423e-984f-69b508a3c845.png)
* Mapache: El mapache comienza a aumentar su escala de forma horizontal "estirándose" para despues regresar a su escala original y cambiando de color.
* Persona: La estatua vuela por la habitación al darle click, cambiando de color, y luego regrese a su posición original. 
* Cubo y estatua enredada: Estas figuras cambian de escala (el tamaño del cubo disminuye y el de la enredada aumenta) y color para después regresar a su tamaño y color original.
### Interacción con pinturas:

* En este caso todas funcionan de la misma forma: Cuando se da click a la pintura esta se mueve (play al video) y luego regresa a su posición original para que el usuario pueda volver a interactuar con ella.
	
## Modelo 3d(preview) y plano:

![image](https://user-images.githubusercontent.com/42380925/140802260-760024f2-c8bb-48f0-bb78-59d826145e12.png)

![image](https://user-images.githubusercontent.com/42380925/140802233-b1e5df60-fafb-4e1c-a1cb-86bce8558616.png)

![image](https://user-images.githubusercontent.com/42380925/140802213-45a6798a-b668-4dda-bffc-914c0192be5a.png)

![image](https://user-images.githubusercontent.com/42380925/140802192-b1bcfc3c-cec1-4865-a502-9e5ba27000d6.png)

![WhatsApp Image 2021-11-07 at 12 07 07 PM](https://user-images.githubusercontent.com/42380925/140802101-4061ae8a-b42f-4985-9ff2-a4ec84bb0561.jpeg)

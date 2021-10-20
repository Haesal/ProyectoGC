# ProyectoGC de Bruno Hae y Jesús Alcala

Museo de arte interactivo, donde la persona puede leer la descripcion de ciertas piezas (pinturas y esculturas), al igual de que podra interactuar con ellas generando un cambio o efecto en estas. Las piezas nosotros las crearemos o selecionaremos. El modelo del museo no lo queremos hacer de un museo real, nosotros diseñaremos como es.

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

La forma en la que planeamos cumplir los requerimientos es con el uso de librerías que nos facilitarían el desarrollo de los elementos que requerimos:

* Three (Uso general, vimos que es muy usado para webgl y facilita muchas de las tareas).

* jQuery (Creemos que nos ayudara a manejar eventos, no estamos muy seguros si será necesario sobre lo que js ya ofrece, pero lo tenemos en cuenta).

* Cannon JS y PointerLockControl (Esto lo usaremos para el moviemiento de la camara y aspectos relacionados).



## Primera entrega del proyecto 

La forma en la que el usario interactua con las estatuas y las pinturas es mediante el click a una distancia cercana. Se manejará el comportanmiento de cada pieza con estados, listeners y raycasting con el fin de que ciertos procesos no se puedan interrumpir y los comportamientos sean como nosostros los esperamos.

### Interacción con estatuas (Todo puede cambiar, dependiendo de lo que veamos que podemos animar):

* Venus de Milo: cuando el usuario le de click se espera que Venus voltee a ver a la posición en donde te encontrabas cuando diste el click y después de 5 segundos vuelva a su posición normal. También, si es posible, que la estatua cambie de color a uno aleatorio.
* Perro de Origami: Lo que planeamos que haga el perro es que se comporte como si lo hubieras acariciado (como se ve en la imagen) y después de 7 segundos regrese a su posición normal.
![imagen](https://user-images.githubusercontent.com/61795705/137788187-0fc5213c-f202-423e-984f-69b508a3c845.png)
* Mapache: Queremos que el mapache cambie de escalas de manera aleatoria, al mismo tiempo que vaya cambiando de color. Al final, depués de 5 segundos, que regrese a como estaba.
* Persona: Queremos que la estatua vuele por la habitación, cambiando de color, y luego regrese a su posición original. (10 segundos)
* Cubo y estatua enredada: Queremos que estas figuras vayan rotando sobre su propio eje, mientras se cambia su escala y color constantemente. En el proceso que esto pase flotaran un poco. (10 segundos)
### Interacción con pinturas:

* En este caso todas funcionan de la misma forma: cuando se de click a la pintura esta se moverá (play al video) y luego regresará a su posición original para que el usuario pueda volver a interactuar con ella.
	

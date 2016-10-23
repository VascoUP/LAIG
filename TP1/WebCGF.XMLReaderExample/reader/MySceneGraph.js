//SceneGraph's constructor
function MySceneGraph(filename, scene) {
	this.loadedOk = null;
	
	// Establish bidirectional references between scene and graph
	this.scene = scene;
	scene.graph = this;

	this.transformations = {};
	this.primitives = {};
	this.graph = new Graph(this);

	// File reading 
	this.reader = new CGFXMLreader();

	/*
	 * Read the contents of the xml file, and refer to this class for loading and error handlers.
	 * After the file is read, the reader calls onXMLReady on this object.
	 * If any error occurs, the reader calls onXMLError on this object, with an error message
	 */
	 
	this.reader.open('scenes/'+filename, this);  
}

//Callback to be executed after successful reading
MySceneGraph.prototype.onXMLReady=function() 
{
	console.log("XML Loading finished.");
	var rootElement = this.reader.xmlDoc.documentElement;
	
	// Here should go the calls for different functions to parse the various blocks
	var error = this.parseDSX(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}	

	this.loadedOk=true;
	
	// As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
	this.scene.onGraphLoaded();
};

//Verifies if each element is in the right place
MySceneGraph.prototype.parseDSX= function(rootElement) {

	var ch = rootElement.children;
	var err;

	if( ch == null || ch.length != 9 )
		return "DSX -> Too few, or too many, elements";

	for( var i = 0; i < ch.length; i++ ) {
		var name = ch[i].tagName;

		switch(name) {
		case 'scene':

			if( i != 0 )
				console.warn("<scene> element is out of place");

			if( (err = this.parseScenes(ch[i])) != null )
				return err;
			pScene = true;

			break;

		case 'views':

			if( i != 1 )
				console.warn("<views> element is out of place");

			if( (err = this.parseViews(ch[i])) != null )
				return err;

			break;

		case 'illumination':

			if( i != 2 )
				console.warn("<illumination> element is out of place");
			
			if( (err = this.parseIlluminations(ch[i])) != null )
				return err;

			break;

		case 'lights':

			if( i != 3 )
				console.warn("<lights> element is out of place");
			
			if( (err = this.parseLights(ch[i])) != null )
				return err;

			break;

		case 'textures':

			if( i != 4 )
				console.warn("<textures> element is out of place");
			
			if( (err = this.parseTextures(ch[i])) != null )
				return err;

			break;

		case 'materials':

			if( i != 5 )
				console.warn("<materials> element is out of place");
			
			if( (err = this.parseMaterials(ch[i])) != null )
				return err;

			break;

		case'transformations':

			if( i != 6 )
				console.warn("<transformations> element is out of place");
			
			if( (err = this.parseTransformations(ch[i])) != null )
			return err;

			break;

		case 'primitives':

			if( i != 7 )
				console.warn("<primitives> element is out of place");
			
			if( (err = this.parsePrimitives(ch[i])) != null )
				return err;

			break;

		case 'components':

			if( i != 8 )
				console.warn("<components> element is out of place");
			
			if( (err = this.parseComponents(ch[i])) != null )
				return err;

			break;

		default:
			return "No such element - " + name;
		}
	}

	return this.graph.connectedGraph();
};

//Callback to be executed on any read error
MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);	
	this.loadedOk=false;
};

//Parses the scene's elements
MySceneGraph.prototype.parseScenes = function(scene_elems) {
	
	if (scene_elems == null)
		return "Scene error";

	this.graph.idHead = this.reader.getString(scene_elems, 'root');
	this.axis_length = this.reader.getFloat(scene_elems, 'axis_length');
	
	if(this.graph.idHead == 'undefined' || this.axis_length == 'undefined')
		return "Scene -> Missing required information.";
	
};

//Parses the the different views' elements
MySceneGraph.prototype.parseViews = function(views_elems) {

	var nnodes = views_elems.children.length;
	if (views_elems == null || nnodes < 1) 
		return "Views error";

	this.default_view = this.reader.getString(views_elems, 'default');
	
	if(this.default_view == 'undefined')
		return "View -> Default View -> Missing required information.";
	
	this.views=[nnodes];

	for(var i = 0; i < nnodes; i++) {

		var perspective_elems = views_elems.children[i];

		if (perspective_elems == null)
			return "Views -> Prespectives error";

		var id, near, far, angle;
		id = perspective_elems.id;
		near = this.reader.getFloat(perspective_elems, 'near');
		far = this.reader.getFloat(perspective_elems, 'far');
		angle = Math.PI * this.reader.getFloat(perspective_elems,'angle') / 180;
		
		if(id == 'undefined' || near == 'undefined' || far == 'undefined' || angle == 'undefined')
			return ("Views -> Prespective " + id + " -> Missing required information.");
		
		if(angle < 0 || angle > 2*Math.PI)
			return "Views -> Prespective " + id + " -> Angle with wrong values.";

		//Making sure that there are no to prespectives with the same id
		for(var j = 0; j < this.views.length; j++) {
			if(this.views[j] == null)
				break;
			if(this.views[j].id == id)
				return "Views -> Prespective " + id + " -> Same id error";
		}

		this.views[i] = new ViewInfo(id, near, far, angle);
		
		if(this.views[0].id != this.default_view)
			return "Views -> First view defined is not equal to default view";

		var from_elems = perspective_elems.getElementsByTagName('from');

		if(from_elems == null || from_elems.length != 1)
			return "Views -> Prespective " + id + " -> From error";

		var fromE = from_elems[0];
		
		if(	this.reader.getFloat(fromE, 'x') == 'undefined' ||
			this.reader.getFloat(fromE, 'y') == 'undefined' ||
			this.reader.getFloat(fromE, 'z') == 'undefined'	)
				return "Views -> Prespective "+ id + " -> 'From' elements missing.";
			
		this.views[i].setFrom(this.reader.getFloat(fromE, 'x'),
								this.reader.getFloat(fromE, 'y'),
								this.reader.getFloat(fromE, 'z'));

		var to_elems = perspective_elems.getElementsByTagName('to');

		if(to_elems == null || to_elems.length != 1)
			return "Views -> Prespective " + id + " -> To error";

		var toE = to_elems[0];
		
		if(	this.reader.getFloat(toE, 'x') == 'undefined' ||
			this.reader.getFloat(toE, 'y') == 'undefined' ||
			this.reader.getFloat(toE, 'z') == 'undefined'	)
				return "Views -> Prespective "+ id + " -> 'To' elements missing.";
			
		this.views[i].setTo(this.reader.getFloat(toE, 'x'),
								this.reader.getFloat(toE, 'y'),
								this.reader.getFloat(toE, 'z'));
	}
};

//Parses the illumnitations' elements
MySceneGraph.prototype.parseIlluminations = function(illumination) {
	
	if (illumination == null) 
		return "Illumination error";

	var illumination_elem = illumination;
	
	var doublesided = this.reader.getBoolean(illumination_elem, 'doublesided');
	var local = this.reader.getBoolean(illumination_elem, 'local');
	
	if(	(doublesided == 'undefined' || (doublesided != 0 && doublesided != 1 ))||
		(local == 'undefined' || (local != 0 && local != 1)))
			return "Illumination -> Doublesided or local variables missing or with wrong values.";

	var ambient = illumination_elem.getElementsByTagName('ambient');

	if( ambient == null || ambient.length != 1)
		return "Illumination -> Ambient error";
	else if( ambient.length > 1 ) 
		//It should stop reading the dsx file because of this
		console.warn("There are more than 1 ambient elements in illumination, only the first will be considered");

	var ambient_elem = ambient[0];

	var r, g, b, a;
	r = this.reader.getFloat(ambient_elem, 'r');
	g = this.reader.getFloat(ambient_elem, 'g');
	b = this.reader.getFloat(ambient_elem, 'b');
	a = this.reader.getFloat(ambient_elem, 'a');
	
	if(	(r == 'undefined' || r < 0 || r > 1) ||
		(g == 'undefined' || g < 0 || g > 1) ||
		(b == 'undefined' || b < 0 || b > 1) ||
		(a == 'undefined' || a < 0 || a > 1) )
			return "Illumination -> Ambient -> Missing required information or variables with wrong values";
			
	this.ambient = [r, g, b, a];

	var background = illumination_elem.getElementsByTagName('background');

	if( background == null || background.length != 1)
		return "Illumination -> Background error";
	else if( background.length > 1 ) 
		//It should stop reading the dsx file because of this
		console.warn("There are more than 1 ambient elements in illumination, only the first will be considered");

	var background_elem = background[0];

	r = this.reader.getFloat(background_elem, 'r');
	g = this.reader.getFloat(background_elem, 'g');
	b = this.reader.getFloat(background_elem, 'b');
	a = this.reader.getFloat(background_elem, 'a');
	
	if(	(r == 'undefined' || r < 0 || r > 1) ||
		(g == 'undefined' || g < 0 || g > 1) ||
		(b == 'undefined' || b < 0 || b > 1) ||
		(a == 'undefined' || a < 0 || a > 1) )
			return "Illumination -> Background -> Missing required information or variables with wrong values";
			
	this.background = [r, g, b, a];	
};

//Parses the lights' elements
MySceneGraph.prototype.parseLights = function(lights) {

	var lights;

	this.nLights = 0;
	this.index = 0;
	this.name = ""; //Lights name (omni or spot)
	this.lightType = [this.name]; //To save the type of lights

	nnodes = lights.children.length;
	if (lights == null || nnodes < 1) 
		return "Lights error -> You need at least one omni ou spot lights";

	var lightsId = [];

	for( var i = 0; i < lights.children.length; i++ ) {

		var light = lights.children[i];
		var id = this.reader.getString(light, 'id');
		
		if(id == 'undefined')
			return "Lights -> Missing the light's id";

		for( var j = 0; j < lightsId.length; j++)
			//Check whether the id of all lights is the same
			if( lightsId[j] == id )
				return "Lights -> There are 2 lights with the same id";

		var locations = light.getElementsByTagName('location');
		var ambients = light.getElementsByTagName('ambient');
		var diffuses = light.getElementsByTagName('diffuse');
		var speculars = light.getElementsByTagName('specular');

		if( locations.length < 1 || ambients.length < 1 || diffuses.length < 1 || speculars < 1 )
			return "Lights -> Missing required information.";

		if( locations.length > 1 )
			console.warn("Lights -> Only 1 location is needed.");

		var location_x = this.reader.getFloat(locations[0], 'x');
		var location_y = this.reader.getFloat(locations[0], 'y');
		var location_z = this.reader.getFloat(locations[0], 'z');
		
		var type = lights.children[i].tagName;
		var location_w;
		if(type == 'omni')
			location_w = this.reader.getFloat(locations[0], 'w');
		else
			location_w = 1; //To ensure that we set the light position with the variable w
	
		if( location_x == 'undefined' || 
			location_y == 'undefined' ||
			location_z == 'undefined' ||
			location_w == 'undefined' )
				return "Lights -> Location -> Missing required information.";
		
		if( ambients.length > 1 )
			console.warn("Lights -> Only 1 ambient is needed.");

		var ambient_r = this.reader.getFloat(ambients[0], 'r');
		var ambient_g = this.reader.getFloat(ambients[0], 'g');
		var ambient_b = this.reader.getFloat(ambients[0], 'b');
		var ambient_a = this.reader.getFloat(ambients[0], 'a');

		if( (ambient_r == 'undefined' || ambient_r < 0 || ambient_r > 1) ||
			(ambient_g == 'undefined' || ambient_g < 0 || ambient_g > 1) ||
			(ambient_b == 'undefined' || ambient_b < 0 || ambient_b > 1) ||
			(ambient_a == 'undefined' || ambient_a < 0 || ambient_a > 1))
				return "Lights -> Ambient -> Missing required information or variables with wrong values.";

		if( diffuses.length > 1 )
			console.warn("Lights -> Only 1 diffuse is needed.");

		var diffuse_r = this.reader.getFloat(diffuses[0], 'r');
		var diffuse_g = this.reader.getFloat(diffuses[0], 'g');
		var diffuse_b = this.reader.getFloat(diffuses[0], 'b');
		var diffuse_a = this.reader.getFloat(diffuses[0], 'a');

		if( (diffuse_r == 'undefined' || diffuse_r < 0 || diffuse_r > 1) ||
			(diffuse_g == 'undefined' || diffuse_g < 0 || diffuse_g > 1) ||
			(diffuse_b == 'undefined' || diffuse_b < 0 || diffuse_b > 1) ||
			(diffuse_a == 'undefined' || diffuse_a < 0 || diffuse_a > 1))
				return "Lights -> Diffuse -> Missing required information or variables with wrong values.";

		if( speculars.length > 1 )
			console.warn("Lights -> Only 1 specular is needed.");

		var specular_r = this.reader.getFloat(speculars[0], 'r');
		var specular_g = this.reader.getFloat(speculars[0], 'g');
		var specular_b = this.reader.getFloat(speculars[0], 'b');
		var specular_a = this.reader.getFloat(speculars[0], 'a');

		if( (specular_r == 'undefined' || specular_r < 0 || specular_r > 1) ||
			(specular_g == 'undefined' || specular_b < 0 || specular_b > 1) ||
			(specular_b == 'undefined' || specular_g < 0 || specular_g > 1) ||
			(specular_a == 'undefined' || specular_a < 0 || specular_a > 1))
				return "Lights -> Diffuse -> Missing required information or variables with wrong values.";

		this.scene.lights[this.nLights].setPosition(location_x, location_y, location_z, location_w);
		this.scene.lights[this.nLights].setAmbient(ambient_r, ambient_g, ambient_b, ambient_a);
		this.scene.lights[this.nLights].setDiffuse(diffuse_r, diffuse_g, diffuse_b, diffuse_a);
		this.scene.lights[this.nLights].setSpecular(specular_r, specular_g, specular_b, specular_a);
		
		this.index = this.nLights;
		this.name = "omni";
		
		this.lightType.push(this.name);

		if( type == 'spot' ) {
			var targets = light.getElementsByTagName('target');

			if( targets.length < 1 )
				return "Lights -> Spot -> Missing required information.";

			if( targets.length > 1 )
				console.warn("Lights -> Spot -> Only 1 location is needed.");

			var target_x = this.reader.getFloat(targets[0], 'x');
			var target_y = this.reader.getFloat(targets[0], 'y');
			var target_z = this.reader.getFloat(targets[0], 'z');

			if( target_x == 'undefined' || 
				target_y == 'undefined' ||  
				target_z  == 'undefined' )
				return "Lights -> Spot -> Target -> Missing required information.";

			var angle = Math.PI * this.reader.getFloat(light, 'angle') / 180 ;
			var exponent = this.reader.getFloat(light, 'exponent') ;
			
			if(( 0 > angle || angle > 2 * Math.PI || angle == 'undefined') || exponent == 'undefined')
				return "Lights -> Spot -> Missing required information or variables with wrong values.";
			
			this.scene.lights[this.nLights].setSpotCutOff( angle );
			this.scene.lights[this.nLights].setSpotExponent( exponent );
			this.scene.lights[this.nLights].setSpotDirection( target_x - location_x, target_y - location_y, target_z - location_z );
		
			this.name = "spot";
			/* 	Because we first read information that is equal to omni and spot lights, so we save one more omni 
				light and after we replaced it by the respective spot light */
			if(this.index == this.nLights)
				this.lightType[this.lightType.length-1] = this.name; 
			else
				this.lightType.push(this.name);
		}

		this.scene.lights[this.nLights].update();

		var enabled = this.reader.getBoolean(light,  'enabled');
		if(  enabled == 'undefined' || (enabled != 0 && enabled != 1) )
			return "Lights -> Property enabled with wrong values or missing information.";
		
		if( enabled )
			this.scene.lights[this.nLights].enable();
		else
			this.scene.lights[this.nLights].disable();

		lightsId.push(id);

		this.nLights++;
	}
};

//Parses the different textures
MySceneGraph.prototype.parseTextures = function(texture) {
	
	var texture;
	
	if (texture == null ) 
		return "Texture error";
	
	this.textures = {};

	var texture_elem = texture.getElementsByTagName('texture');
	
	for( var i = 0; i < texture_elem.length; i++ ) {
		var textureElem = texture_elem[i];
		var id = this.reader.getString(texture_elem[i], 'id');

		// Making sure that there are no two textures with the same id 
		if( this.textures[id] != undefined)
			return "Textures-> There are 2 textures with the same id (id="+id+")";

		var file = this.reader.getString(texture_elem[i], 'file');
		var t = new CGFtexture(this.scene, file);
		var texInfo = new TextureInfo( t, this.reader.getFloat(texture_elem[i], 'length_t'), 
											this.reader.getFloat(texture_elem[i], 'length_s'));

		this.textures[id] = texInfo;
	}
};

//Parses the materials
MySceneGraph.prototype.parseMaterials = function(material) {
	
	/*
		Materials

		TO DO:
			????????????????
	*/
	var nnodes = material.children.length;
	
	if(material == null || nnodes < 1) 
		return "Material error";
	
	this.materials = {};

	for(var i = 0; i < nnodes; i++) {

		var material_elems = material.children[i];

		if (material_elems == null)
			return "Materials -> Material error";

		var id = material_elems.attributes.getNamedItem('id').value;
	
		// Making sure that there are no two materials with the same id 
		if( this.materials[id] != undefined )
			return "Materials -> Same id error";

		var appearance = new CGFappearance(this.scene);

		var emission = material_elems.getElementsByTagName('emission');

		if(emission == null || emission.length < 1)
			return "Materials -> Emission-> Variable error";

		var r, g, b, a;
		var emissionElem = emission[0];
		r = this.reader.getFloat(emissionElem, 'r');
		g = this.reader.getFloat(emissionElem, 'g');
		b = this.reader.getFloat(emissionElem, 'b');
		a = this.reader.getFloat(emissionElem, 'a');
		
		appearance.setEmission(r, g, b, a);
		
		var ambient = material_elems.getElementsByTagName('ambient');
		if(ambient == null || ambient.length < 1)
			return "Materials -> Ambient-> Variable error";

		var ambientElem = ambient[0];
		r = this.reader.getFloat(ambientElem, 'r');
		g = this.reader.getFloat(ambientElem, 'g');
		b = this.reader.getFloat(ambientElem, 'b');
		a = this.reader.getFloat(ambientElem, 'a');
		
		appearance.setAmbient(r, g, b, a);

		var diffuse = material_elems.getElementsByTagName('diffuse');
		if(diffuse == null || diffuse.length < 1)
			return "Materials -> Diffuse-> Variable error";

		var diffuseElem = diffuse[0];
		r = this.reader.getFloat(diffuseElem, 'r');
		g = this.reader.getFloat(diffuseElem, 'g');
		b = this.reader.getFloat(diffuseElem, 'b');
		a = this.reader.getFloat(diffuseElem, 'a');
		
		appearance.setDiffuse(r, g, b, a);
								
		var specular = material_elems.getElementsByTagName('specular');
		if(specular == null || specular.length < 1)
			return "Materials -> Specular-> Variable error";

		var specularElem = specular[0];
		r = this.reader.getFloat(specularElem, 'r');
		g = this.reader.getFloat(specularElem, 'g');
		b = this.reader.getFloat(specularElem, 'b');
		a = this.reader.getFloat(specularElem, 'a');
		
		appearance.setSpecular(r, g, b, a);
								
		var shininess = material_elems.getElementsByTagName('shininess');
		if(shininess == null || shininess.length < 1)
			return "Materials -> Shininess-> Variable error";

		var shininessElem = shininess[0];
		var shininess = this.reader.getFloat(shininessElem, 'value');
		
		appearance.setShininess(shininess);
		appearance.setTextureWrap('REPEAT', 'REPEAT');
		
		this.materials[id] = appearance;
	}
};

//Parses the transformations
MySceneGraph.prototype.parseTransformations = function(transformations) {
		
	/*
		Transformations

		TO DO:
		????????????????????????
	*/
	var nnodes = transformations.children.length;
	
	if (transformations == null || nnodes < 1) 
		return "Tranformations error";

	for(var i = 0; i < nnodes; i++) {

		var transform_elems = transformations.children[i];
		if (transform_elems == null)
			return "Transformation error";

		var id = transform_elems.attributes.getNamedItem('id').value;
	
		// Making sure that there are no two transformations with the same id
		if( this.transformations[id] != undefined )
			return "Transformations -> Same id error";

		var matrix = mat4.create();
		this.transformations[id] = matrix;
		//this.transformations[id] = new TransformationInfo(id);

		for(var k = 0; k < transform_elems.children.length; k++){
			var transformation = transform_elems.children[k].tagName;
			
			if( transformation == 'rotate' ) {
				var axis, angle;
				angle = Math.PI * this.reader.getFloat(transform_elems.children[k], 'angle') / 180;
				axis = this.reader.getString(transform_elems.children[k], 'axis');
				mat4.rotate(matrix, matrix, angle, axis == 'x' ? [1, 0, 0] : axis == 'y' ? [0, 1, 0] : [0, 0, 1]);
				//this.transformations[id].addTransform(transformation, [axis, angle]);
			}
			else {
				var x, y, z;
				x = this.reader.getFloat(transform_elems.children[k], 'x');
				y = this.reader.getFloat(transform_elems.children[k], 'y');
				z = this.reader.getFloat(transform_elems.children[k], 'z');
				if( transformation == 'scale' )
					mat4.scale(matrix, matrix, [x, y, z]);
				else
					mat4.translate(matrix, matrix, [x, y, z]);
				//this.transformations[id].addTransform(transformation, [x, y, z]);
			}
		}
	}
};

//Parses the different primitives
MySceneGraph.prototype.parsePrimitives = function(primitives) {
	
	/*
		Primitives

		TO DO:
			everything
	*/
	
	var nnodes = primitives.children.length;
	
	if (primitives == null || nnodes < 1) 
		return "Primitives error";

	for(var i = 0; i < nnodes; i++) {

		var prim_elems = primitives.children[i];

		if (prim_elems == null)
			return "Primitives -> Primitive error";


		var id = prim_elems.attributes.getNamedItem('id').value;
	
		// Making sure that there are no two primitives with the same id 
		if(this.primitives[id] != undefined)
			return "There are 2 primitives with the same name";

		var primitive = prim_elems.children[0].tagName;
		
		switch(primitive) {
			case 'rectangle':
				var x1, y1, x2, y2;
				x1 = this.reader.getFloat(prim_elems.children[0], 'x1');
				y1 = this.reader.getFloat(prim_elems.children[0], 'y1');
				x2 = this.reader.getFloat(prim_elems.children[0], 'x2');
				y2 = this.reader.getFloat(prim_elems.children[0], 'y2');
				this.primitives[id] = new MyRectangle(this.scene, x1, y1, x2, y2);
				break;
			case 'triangle':
				var x1, y1, z1, x2, y2, z2, x3, y3, z3;
				x1 = this.reader.getFloat(prim_elems.children[0], 'x1');
				y1 = this.reader.getFloat(prim_elems.children[0], 'y1');
				z1 = this.reader.getFloat(prim_elems.children[0], 'z1');
				x2 = this.reader.getFloat(prim_elems.children[0], 'x2');
				y2 = this.reader.getFloat(prim_elems.children[0], 'y2');
				z2 = this.reader.getFloat(prim_elems.children[0], 'z2');
				x3 = this.reader.getFloat(prim_elems.children[0], 'x3');
				y3 = this.reader.getFloat(prim_elems.children[0], 'y3');
				z3 = this.reader.getFloat(prim_elems.children[0], 'z3');
				this.primitives[id] = new MyTriangle(this.scene, x1, y1, z1, x2, y2, z2, x3, y3, z3);
				break;
			case 'cylinder':
				var base, top, heigth, slices, stacks;
				base = this.reader.getFloat(prim_elems.children[0], 'base');
				top = this.reader.getFloat(prim_elems.children[0], 'top');
				height = this.reader.getFloat(prim_elems.children[0], 'height');
				slices = this.reader.getInteger(prim_elems.children[0], 'slices');
				stacks = this.reader.getInteger(prim_elems.children[0], 'stacks');
				this.primitives[id] = new MyCylinder(this.scene, base, top, height, slices, stacks);
				break;
			case 'sphere':
				var radius, slices, stacks;
				radius = this.reader.getFloat(prim_elems.children[0], 'radius');
				slices = this.reader.getInteger(prim_elems.children[0], 'slices');
				stacks = this.reader.getInteger(prim_elems.children[0], 'stacks');
				this.primitives[id] = new MySphere(this.scene, radius, slices, stacks);
				break;
			case 'torus':
				var inner, outer, slices, loops;
				inner = this.reader.getFloat(prim_elems.children[0], 'inner');
				outer = this.reader.getFloat(prim_elems.children[0], 'outer');
				slices = this.reader.getInteger(prim_elems.children[0], 'slices');
				loops = this.reader.getInteger(prim_elems.children[0], 'loops');
				this.primitives[id] = new MyTorus(this.scene, inner, outer, slices, loops);
				break;
		}
	}
};

//Parses the componenets
MySceneGraph.prototype.parseComponents = function (components) {
	
	/*
		Components

		TO DO:
		Create a node and add it to the graph
		Add materials, textures, transformations, ..., to the node
	*/
	var nnodes = components.children.length;
	
	if (components == null || nnodes < 1) 
		return "Components error";
	
	this.component = [nnodes];

	for(var i = 0; i < nnodes; i++) {

		var comp_elems = components.children[i];

		if (comp_elems == null)
			return "Components -> Component error";

		var id = comp_elems.attributes.getNamedItem('id').value;

		var n = new Node();
		this.graph.addNode(id, n);
	
		// Making sure that there are no two components with the same id 
		for(var j = 0; j < this.component.length; j++) {
			if(this.component[j].id == id)
				return "Components -> Same id error";
		}
		
		this.readComponentTransformation(comp_elems,n);
		this.readComponentMaterials(comp_elems,n);
		this.readComponentTextures(comp_elems,n);
		this.readComponentChildren(comp_elems,n);
	}
};

//Reads the transformations of each component
MySceneGraph.prototype.readComponentTransformation = function (compElement, node) {

	var transformations = compElement.getElementsByTagName('transformation');
	var nnodes = transformations[0].children.length;
	if (transformations == null || transformations.length != 1) 
		return "Component -> Tranformation error";
	
	for(var i = 0; i < nnodes; i++) {

		var transform_elems = transformations[0].children[i];
		if (transform_elems == null)
			return "Component -> Transformation error";
		var id;

		//this.transform[i] = new TransformationInfo(id);

		var transformation = transform_elems.tagName;
		switch(transformation) {
			case 'transformationref':
				id = this.reader.getString(transform_elems, 'id');

				if( nnodes != 1 )
					return "You either have transformationref OR the transformations you want that haven't been defined before.";

				node.setTransformationId(id);

				break;
			case 'translate':
				var x, y, z;
				x = this.reader.getFloat(transform_elems, 'x');
				y = this.reader.getFloat(transform_elems, 'y');
				z = this.reader.getFloat(transform_elems, 'z');
				node.addTransform(transformation, [x, y, z]);
				break;
			case 'rotate':
				var axis, angle;
				angle = Math.PI * this.reader.getFloat(transform_elems, 'angle') / 180;
				axis = this.reader.getString(transform_elems, 'axis');
				node.addTransform(transformation, [angle, axis]);
				break;
			case 'scale':
				var x, y, z;
				x = this.reader.getFloat(transform_elems, 'x');
				y = this.reader.getFloat(transform_elems, 'y');
				z = this.reader.getFloat(transform_elems, 'z');
				node.addTransform(transformation, [x, y, z]);
				break;
		}
			
		if(id != null)
			break;
	}
};

//Reads the materials of each component
MySceneGraph.prototype.readComponentMaterials = function (compElement, node) {
	var materials = compElement.getElementsByTagName('materials');
	var nnodes = materials[0].children.length;
	if (materials == null || materials.length != 1 || nnodes < 1) 
		return "Component -> Materials error";

	for(var i = 0; i < nnodes; i++) {
			
		var material_elems = materials[0].children[i];

		if (material_elems == null)
			return "Materials -> Material error";

		var id = material_elems.attributes.getNamedItem('id').value;
		
		node.addIdMaterial(id);
	}
	
	
};

//Reads the texture of each component
MySceneGraph.prototype.readComponentTextures = function (compElement, node) {
	var texture = compElement.getElementsByTagName('texture');
	if(texture == null)
		return "Component -> Texture error";

	var id = texture[0].attributes.getNamedItem('id').value;

	node.setIdTexture(id);
};

//Reads the children of each component
MySceneGraph.prototype.readComponentChildren = function (compElement, node) {
	//Falta desenvolver tudo :P
	var ch = compElement.getElementsByTagName('children');
	if (ch == null || ch.length != 1) 
		return "Children error";
	
	var id;
	var countComp = 0, countPrim = 0;

	var childrenElems = ch[0].children;
	for(var j = 0; j < childrenElems.length; j++) {

		var childrenTag = childrenElems[j].tagName;
		switch(childrenTag) {
			case 'componentref':
				id = this.reader.getString(childrenElems[j], 'id');
				node.addIdChildren(id);
				countComp++;
				break;
			case 'primitiveref':
				id = this.reader.getString(childrenElems[j], 'id');
				node.addIdPrimitive(id);
				countPrim++;
				break;
		}
	}
};
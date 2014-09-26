SimpleSVG v0.1.1

The simpliest javascript svg library you will ever use.

## Features:

``append``
Create element by name and insert to the end of element

``attr``
Get attribute by name 
or 
Set one or more attributes

``css``
Get style by name 
or 
Set one or more style properties

``each``
Execute a callback for every element in the matched set.

``empty``
Remove all child nodes of the set of matched elements from the DOM.

``filter``
Filter a selection using css selectors.

``html``
Get the HTML contents of the first element in the set of matched elements 
or 
Set the HTML contents of each element in the set of matched elements

``prepend``
Create element by name and insert to the beginning

``remove``
Remove the set of matched elements from the DOM.

``select``
Select elements from the DOM

``text``
Get the combined text contents of each element in the set of matched elements 
or 
Set the content of each element in the set of matched elements to the specified text

## Example

```JAVASCRIPT
<div id="container"></div>
<script type="text/javascript">
	var container = SimpleSvg.select('#container');
	var svg = SimpleSvg.select('#container')
			.append('svg')
			.attr({
				'id': 'container-svg',
				'width': 100,
				'height': 150
			});
	var mainLayer = svg.append('g')
			.attr({
				"id": "all-layers"
			});
	mainLayer.append("path")
			.attr({
				"d": "M10 15 90 20 90 120 20 130Z",
				"is-selected": "false",
				"obj-id": "ss",
				"id": "path",
				"class": "path",
				"stroke-opacity": "0",
				"fill": "rgba(0, 0, 125, 0.9)"
			});
</script>
```

## Browser Support

IE 9+

## Suggestions?

Please add an issue with ideas, improvements, or bugs! Thanks!

---

(c) 2013 MIT License
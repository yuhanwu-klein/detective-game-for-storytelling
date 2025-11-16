"""
Blender Cloud-Shaped Stairs Generator
Creates a whimsical cloud-like staircase with soft, organic forms
"""

import bpy
import math
from mathutils import Vector

# Clear existing mesh objects
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

# Configuration
num_steps = 12  # Number of stairs
height_per_step = 0.3  # Height increment per step
radius = 3.0  # Radius of the spiral
angle_per_step = 30  # Degrees rotation per step
step_width = 1.2  # Width of each step
step_depth = 0.8  # Depth of each step
cloud_puffiness = 0.4  # How puffy/cloud-like the steps are

# Create cloud-like step function
def create_cloud_step(location, rotation_z, step_number):
    """Create a single cloud-shaped step"""

    # Create base cube for the step
    bpy.ops.mesh.primitive_cube_add(
        size=1,
        location=location,
        rotation=(0, 0, rotation_z)
    )

    step = bpy.context.active_object
    step.name = f"CloudStep_{step_number:02d}"

    # Scale to step dimensions
    step.scale = (step_width, step_depth, cloud_puffiness)

    # Apply scale
    bpy.ops.object.transform_apply(scale=True)

    # Add subdivision surface for smooth cloud shape
    subsurf = step.modifiers.new(name="Subdivision", type='SUBSURF')
    subsurf.levels = 2
    subsurf.render_levels = 3

    # Add displacement modifier for cloud texture
    displace = step.modifiers.new(name="CloudDisplace", type='DISPLACE')
    displace.strength = 0.15

    # Create cloud texture
    if f"CloudTexture_{step_number}" not in bpy.data.textures:
        cloud_tex = bpy.data.textures.new(f"CloudTexture_{step_number}", 'CLOUDS')
        cloud_tex.noise_scale = 0.5
        cloud_tex.noise_depth = 3
        displace.texture = cloud_tex

    # Smooth shading
    bpy.ops.object.shade_smooth()

    # Create fluffy cloud edges using additional geometry
    bpy.ops.object.modifier_add(type='BEVEL')
    bevel = step.modifiers[-1]
    bevel.width = 0.1
    bevel.segments = 3

    return step

# Generate spiral staircase
steps = []
for i in range(num_steps):
    # Calculate position
    angle = math.radians(angle_per_step * i)
    x = radius * math.cos(angle)
    y = radius * math.sin(angle)
    z = height_per_step * i

    location = Vector((x, y, z))

    # Create step
    step = create_cloud_step(location, angle, i)
    steps.append(step)

# Create cloud material
cloud_mat = bpy.data.materials.new(name="CloudMaterial")
cloud_mat.use_nodes = True
nodes = cloud_mat.node_tree.nodes
links = cloud_mat.node_tree.links

# Clear default nodes
nodes.clear()

# Create shader nodes for fluffy cloud appearance
output_node = nodes.new(type='ShaderNodeOutputMaterial')
output_node.location = (400, 0)

principled_node = nodes.new(type='ShaderNodeBsdfPrincipled')
principled_node.location = (0, 0)

# Cloud-like white color with subsurface scattering
principled_node.inputs['Base Color'].default_value = (0.95, 0.95, 1.0, 1.0)  # Slight blue-white
principled_node.inputs['Subsurface'].default_value = 0.3  # Soft light diffusion
principled_node.inputs['Subsurface Color'].default_value = (0.9, 0.92, 1.0, 1.0)
principled_node.inputs['Roughness'].default_value = 0.8  # Soft, non-reflective
principled_node.inputs['Specular IOR Level'].default_value = 0.2

# Add noise texture for cloud variation
noise_node = nodes.new(type='ShaderNodeTexNoise')
noise_node.location = (-400, -200)
noise_node.inputs['Scale'].default_value = 3.0
noise_node.inputs['Detail'].default_value = 4.0

color_ramp = nodes.new(type='ShaderNodeValToRGB')
color_ramp.location = (-200, -200)
color_ramp.color_ramp.elements[0].color = (0.9, 0.9, 0.95, 1.0)
color_ramp.color_ramp.elements[1].color = (1.0, 1.0, 1.0, 1.0)

# Connect nodes
links.new(noise_node.outputs['Fac'], color_ramp.inputs['Fac'])
links.new(color_ramp.outputs['Color'], principled_node.inputs['Base Color'])
links.new(principled_node.outputs['BSDF'], output_node.inputs['Surface'])

# Apply material to all steps
for step in steps:
    if step.data.materials:
        step.data.materials[0] = cloud_mat
    else:
        step.data.materials.append(cloud_mat)

# Add supporting cloud pillars (optional decorative elements)
pillar_locations = [
    (0, 0, 0),  # Center pillar
]

for loc in pillar_locations:
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=8,
        radius=0.6,
        depth=num_steps * height_per_step * 0.8,
        location=(loc[0], loc[1], (num_steps * height_per_step * 0.4))
    )
    pillar = bpy.context.active_object
    pillar.name = "CloudPillar"

    # Add cloud modifiers
    subsurf = pillar.modifiers.new(name="Subdivision", type='SUBSURF')
    subsurf.levels = 2

    displace = pillar.modifiers.new(name="CloudDisplace", type='DISPLACE')
    displace.strength = 0.2
    cloud_tex_pillar = bpy.data.textures.new("CloudTexturePillar", 'CLOUDS')
    cloud_tex_pillar.noise_scale = 0.3
    displace.texture = cloud_tex_pillar

    bpy.ops.object.shade_smooth()

    # Apply cloud material
    if pillar.data.materials:
        pillar.data.materials[0] = cloud_mat
    else:
        pillar.data.materials.append(cloud_mat)

# Set up camera
bpy.ops.object.camera_add(location=(8, -8, 6))
camera = bpy.context.active_object
camera.rotation_euler = (math.radians(65), 0, math.radians(45))
bpy.context.scene.camera = camera

# Set up lighting for cloud effect
# Add sun light
bpy.ops.object.light_add(type='SUN', location=(5, 5, 10))
sun = bpy.context.active_object
sun.data.energy = 2.0
sun.data.color = (1.0, 0.98, 0.9)

# Add area light for soft shadows
bpy.ops.object.light_add(type='AREA', location=(-3, -3, 8))
area_light = bpy.context.active_object
area_light.data.energy = 300
area_light.data.size = 5
area_light.data.color = (0.9, 0.95, 1.0)

# Set render settings for better cloud visualization
bpy.context.scene.render.engine = 'CYCLES'
bpy.context.scene.cycles.samples = 128
bpy.context.scene.render.film_transparent = True

# Use Eevee for real-time preview (optional)
# bpy.context.scene.render.engine = 'BLENDER_EEVEE'
# bpy.context.scene.eevee.use_ssr = True
# bpy.context.scene.eevee.use_bloom = True

print("✨ Cloud-shaped staircase created successfully!")
print(f"📊 Steps: {num_steps}")
print(f"📏 Total height: {num_steps * height_per_step:.2f} units")
print(f"🌀 Spiral angle: {num_steps * angle_per_step}°")

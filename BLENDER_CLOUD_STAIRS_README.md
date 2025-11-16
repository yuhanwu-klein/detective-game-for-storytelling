# 云朵形状楼梯 - Blender脚本

这个Blender Python脚本可以生成一个梦幻的云朵形状螺旋楼梯。

## ✨ 特性

- 🌀 **螺旋结构**: 12级旋转上升的楼梯
- ☁️ **云朵外观**: 使用细分表面和置换修改器创建柔软的云朵质感
- 🎨 **真实材质**: 带有次表面散射的云朵材质，呈现蓬松效果
- 💡 **专业照明**: 太阳光和区域光设置，增强云朵视觉效果
- 🏛️ **装饰柱子**: 中心云朵柱子支撑结构

## 🚀 使用方法

### 方法1: 在Blender脚本编辑器中运行

1. 打开Blender
2. 切换到 `Scripting` 工作空间
3. 点击 `Open` 按钮，选择 `blender_cloud_stairs.py`
4. 点击 `Run Script` 按钮（或按 `Alt+P`）
5. 等待脚本执行完成

### 方法2: 从命令行运行

```bash
blender --python blender_cloud_stairs.py
```

### 方法3: 在已打开的Blender文件中运行

```bash
blender your_file.blend --python blender_cloud_stairs.py
```

## ⚙️ 参数配置

你可以在脚本中修改以下参数来自定义楼梯：

```python
num_steps = 12           # 楼梯级数
height_per_step = 0.3    # 每级高度
radius = 3.0             # 螺旋半径
angle_per_step = 30      # 每级旋转角度（度）
step_width = 1.2         # 梯级宽度
step_depth = 0.8         # 梯级深度
cloud_puffiness = 0.4    # 云朵蓬松度
```

## 🎬 渲染设置

脚本默认配置了以下渲染设置：

- **渲染引擎**: Cycles
- **采样数**: 128
- **透明背景**: 启用
- **相机**: 自动设置在最佳观察位置

### 实时预览（可选）

如果你想使用Eevee进行更快的实时预览，在脚本末尾取消以下代码的注释：

```python
bpy.context.scene.render.engine = 'BLENDER_EEVEE'
bpy.context.scene.eevee.use_ssr = True
bpy.context.scene.eevee.use_bloom = True
```

## 🎨 材质说明

云朵材质包含：
- 蓝白色基础颜色（0.95, 0.95, 1.0）
- 次表面散射（0.3）用于柔和光线扩散
- 高粗糙度（0.8）呈现非反射表面
- 噪波纹理用于云朵颜色变化

## 📊 输出信息

脚本运行完成后会显示：
- ✨ 创建成功消息
- 📊 楼梯级数
- 📏 总高度
- 🌀 螺旋总角度

## 🔧 故障排除

### 脚本运行后看不到模型
- 确保在3D视图中按 `Home` 键或滚动鼠标滚轮缩放到适合视图
- 检查大纲视图（Outliner）确认对象已创建

### 云朵效果不明显
- 增加 `Subdivision` 修改器的级数
- 调整 `cloud_puffiness` 参数
- 在渲染视图中查看效果（按 `Z` 键选择渲染预览）

### 渲染太慢
- 降低 Cycles 采样数（从128降到64）
- 切换到 Eevee 渲染引擎

## 💡 创意建议

- 调整 `angle_per_step` 创建不同的螺旋紧密度
- 修改材质颜色创建彩色云朵（如粉色、紫色）
- 增加更多装饰云朵元素
- 添加发光材质创建梦幻效果

## 📝 技术细节

每个梯级包含以下修改器：
1. **Subdivision Surface**: 平滑几何体
2. **Displace**: 使用云朵纹理添加有机变形
3. **Bevel**: 创建蓬松的边缘

## 🎮 集成到游戏项目

如果要将此模型导出到Babylon.js项目：

1. 选择所有楼梯对象
2. File → Export → glTF 2.0 (.glb/.gltf)
3. 导出为 `.glb` 格式
4. 在Babylon.js中加载模型：

```javascript
BABYLON.SceneLoader.ImportMesh("", "./", "cloud_stairs.glb", scene, function(meshes) {
    console.log("Cloud stairs loaded!");
});
```

---

享受你的云朵楼梯创作！☁️✨

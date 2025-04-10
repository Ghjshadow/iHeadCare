import sys
import os
import time
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
# 模拟 dust3r 运行：python run_dust3r.py uploads/img1.jpg uploads/img2.jpg ...
image_paths = sys.argv[1:]

print(f"开始处理 {len(image_paths)} 张图像")
time.sleep(2)  # 模拟处理时间
output_path = "results/reconstruction.obj"

# 模拟输出结果路径
print(f"处理完成，输出路径：{output_path}")

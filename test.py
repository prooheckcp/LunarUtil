import os
import shutil

def move_prooheckcp_contents():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    print(os.listdir(base_dir))
    
    """
    node_modules_dir = os.path.join(base_dir, 'node_modules')
    prooheckcp_dir = os.path.join(node_modules_dir, '@prooheckcp')

    if not os.path.isdir(prooheckcp_dir):
        print(f"The directory '@prooheckcp' does not exist in {node_modules_dir}")
        return

    # Move all contents from @prooheckcp to node_modules
    for item in os.listdir(prooheckcp_dir):
        src_path = os.path.join(prooheckcp_dir, item)
        dest_path = os.path.join(node_modules_dir, item)

        if os.path.exists(dest_path):
            print(f"Warning: {dest_path} already exists. Skipping {src_path}.")
            continue

        shutil.move(src_path, dest_path)
        print(f"Moved: {src_path} -> {dest_path}")

    # Remove the now-empty @prooheckcp directory
    shutil.rmtree(prooheckcp_dir)
    print(f"Removed directory: {prooheckcp_dir}")    
    """


if __name__ == "__main__":
    move_prooheckcp_contents()
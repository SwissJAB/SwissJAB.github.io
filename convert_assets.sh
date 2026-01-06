#!/bin/bash
shopt -s nullglob

# Directories to process (including root for titlepage)
DIRS=("." "Background_Images" "Element_Images" "logos")

echo "Starting media conversion..."

for dir in "${DIRS[@]}"; do
    if [ -d "$dir" ]; then
        echo "Checking directory: $dir"
        cd "$dir"
        
        # Convert Images (PNG, JPG, JPEG) to WebP
        for img in *.{png,jpg,jpeg,PNG,JPG,JPEG}; do
            [ -f "$img" ] || continue
            base="${img%.*}"
            echo "  Converting $img -> ${base}.webp"
            # -y overwrites output if exists
            ffmpeg -nostdin -i "$img" -c:v libwebp -quality 100 "${base}.webp" -y -hide_banner -loglevel error
        done

        # Convert Videos (MP4, MOV, GIF) to WebM
        for vid in *.{mp4,mov,gif,MP4,MOV,GIF}; do
            [ -f "$vid" ] || continue
            base="${vid%.*}"
            echo "  Converting $vid -> ${base}.webm"
            # -an removes audio, -b:v 0 -crf 30 optimizes quality/size
            ffmpeg -nostdin -i "$vid" -c:v libvpx-vp9 -b:v 0 -crf 30 -an "${base}.webm" -y -hide_banner -loglevel error
        done
        
        cd - > /dev/null
    fi
done

echo "Done."
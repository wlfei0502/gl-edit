uniform mat3 model;
uniform float thickness;
uniform int miter;
uniform float aspect;
uniform float height;

attribute vec2 prevPosition;
attribute vec2 currPosition;
attribute vec2 nextPosition;
attribute float offsetScale;

void main() {
    vec2 aspectVec = vec2(aspect, 1.0);
    vec2 prevProject = (model * vec3(prevPosition, 1.0)).xy;
    vec2 currProject = (model * vec3(currPosition, 1.0)).xy;
    vec2 nextProject = (model * vec3(nextPosition, 1.0)).xy;
    vec2 prevScreen = prevProject * aspectVec;
    vec2 currScreen = currProject * aspectVec;
    vec2 nextScreen = nextProject * aspectVec;
    float len = thickness;
    vec2 dir = vec2(0.0);

    // 起点
    if (currScreen == prevScreen) {
        dir = normalize(nextScreen - currScreen);
    }
    // 终点
    else if (currScreen == nextScreen) {
        dir = normalize(currScreen - prevScreen);
    }
    // 中间点，中间点会出现斜角的情况
    else {
        //  normal
        //    \
        //     \         prev
        //       —— —— —— —— ——
        //      | \ 
        //      |  join
        //      |
        //      | next 
        //      |
        vec2 dirA = normalize((currScreen - prevScreen));
        if (miter == 1) {
            vec2 dirB = normalize((nextScreen - currScreen));
            // 计算拐角处的法向量和斜角长度
            vec2 tangent = normalize(dirA + dirB);
            // 旋转90度
            vec2 perp = vec2(-dirA.y, dirA.x);
            vec2 miter = vec2(-tangent.y, tangent.x);
            dir = tangent;
            // 斜角长度
            len = thickness / dot(miter, perp);
        } else {
            dir = dirA;
        }
    }

    // TODO:该处理以屏幕高度像素为基准，确定线的厚度, 此处为近似处理. 期待更好的处理
    float scale = len / height;

    // 旋转90度，缩放scale, 即是该点移动的距离
    vec2 normal = vec2(-dir.y, dir.x) * scale;
    normal.x /= aspect;

    vec4 offset = vec4(normal * offsetScale, 0.0, 1.0);
    gl_Position = vec4(currProject + offset.xy, 0.0, 1.0);
}

import * as THREE from 'three';
window.addEventListener("DOMContentLoaded", function(){
    // 初期化（物理エンジン、3Dエンジン両方）
    function init(width, height, angle, near, far, camerapos, lightdir) {
        // 3Dエンジンのシーン（物理エンジンのワールドに相当するもの）を生成
        const scene = new THREE.Scene();
        return {
            ammo: init_ammo(), // 物理エンジンのワールドを生成して返す
            three_renderer: init_three(),  // 3Dエンジンの画像描画オブジェクトを生成して返す
            three_scene: scene,  // 3Dエンジンのシーンを返す
            three_camera: init_camera_and_light_three() // 3Dエンジンのカメラとライトを生成してカメラを返す
        };

        // 物理エンジンの初期化
        function init_ammo() {
            const collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
            const dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
            const overlappingPairCache = new Ammo.btDbvtBroadphase();
            const solver = new Ammo.btSequentialImpulseConstraintSolver();
            const dynamicsWorld = new Ammo.btDiscreteDynamicsWorld(
                dispatcher, 
                overlappingPairCache, 
                solver, 
                collisionConfiguration
            );
            dynamicsWorld.setGravity(new Ammo.btVector3(0, -10, 0));
            return dynamicsWorld;
        }

        // 3Dエンジンの初期化
        function init_three() {
            // 画像描画オブジェクト（レンダラ）を生成。WEBGLを利用する
            const renderer = new THREE.WebGLRenderer({antialias: true});
            // 描画サイズを設定
            renderer.setSize(width, height);
            // 描画しない部分を空色に設定。2番目の引数はアルファ値
            renderer.setClearColor(0x90D7EC, 1);
            // 画像描画オブジェクトをDOM上に設定する（body直下)
            document.body.appendChild(renderer.domElement);
            // 画像描画オブジェクトを返す
            return renderer;
        }

        // 3Dエンジンのカメラとライトを設定
        function init_camera_and_light_three() {
            // パースペクティブ（透視投影）カメラを設定。引数は、画角、アスペクト比、ニアクリップ、ファークリップの順。
            // カメラの参考資料：http://www56.atwiki.jp/threejs/pages/70.html
            const camera = new THREE.PerspectiveCamera( angle, width / height, near, far );
            // 平行投影カメラの場合は下記記述
            // const scale = 0.1;
            // const camera = new THREE.OrthographicCamera(
            //  -width/2*scale, width/2*scale, height/2*scale, -height/2*scale, 1, 1000);

            // カメラの位置をセット
            camera.position.set(camerapos.x, camerapos.y, camerapos.z);
            // カメラの向きをセット。この場合原点となる。
            camera.lookAt( scene.position );
            // シーンに追加
            scene.add( camera );

            // 平行光源（ライト）を設定。白色、強さを指定
            const directionalLight = new THREE.DirectionalLight( 0xffffff, 5 );
            // カメラの向きを指定（平行光源なので、位置は無関係）
            console.log(lightdir.x);
            directionalLight.position.set(lightdir.x, lightdir.y, lightdir.z);
            // シーンに追加
            scene.add( directionalLight );

            // 軸の追加　 X軸が赤色、Y軸が緑色、Z軸が青色
            const axis = new THREE.AxisHelper(500);
            // 原点にセット
            axis.position.set(0,0,0);
            // シーンに追加
            scene.add(axis);

            // カメラを返す
            return camera;
        }
    }

    // 地面の設定
    function make_ground(size, pos) {
        return {
            ammo: make_ground_ammo(), // 物理エンジンで使う地面を返す
            three: make_ground_three()  // 3Dエンジンで使う地面を返す
        };

        // 物理エンジンの地面設定
        function make_ground_ammo() {
            const form = new Ammo.btTransform();
            form.setIdentity();
            form.setOrigin(pos);
            const ground = new Ammo.btRigidBody(
                new Ammo.btRigidBodyConstructionInfo(
                    0, 
                    new Ammo.btDefaultMotionState(form), 
                    new Ammo.btBoxShape(size),
                    new Ammo.btVector3(0, 0, 0)
                )
            );
            // 反発係数を設定
            ground.setRestitution(1);
            // 摩擦係数を設定
            ground.setFriction(1);
            // ワールドに設定
            world.ammo.addRigidBody(ground);
            return ground;
        }

        // 3Dエンジンの地面設定
        function make_ground_three() {
            // 地面ポリゴンを作成
            const ground = new THREE.Mesh(
                // 箱のポリゴンの頂点情報を設定
                // 物理エンジンのサイズに合わせるためそれぞれ2倍する
                new THREE.BoxGeometry(size.x()*2, size.y()*2, size.z()*2), 
                // 表面の材質の指定。ここではランバート反射。色は灰色とする
                // 参考：http://sawanoya.blogspot.jp/2012/06/blog-post_29.html
                new THREE.MeshLambertMaterial({color: 0x999999})
            );
            // 地面の位置指定
            ground.position.set(pos.x(),pos.y(),pos.z());
            // 地面をシーンに追加
            world.three_scene.add(ground);
            // 地面を返す
            return ground;
        }
    }

    // 球の設定
    function make_sphere(r, mass, pos) {
        return {
            ammo: make_sphere_ammo(),  // 物理エンジンで使う球を返す
            three: make_sphere_three()  // 3Dエンジンで使う球を返す
        };

        // 物理エンジンの球設定
        function make_sphere_ammo() {
            const form = new Ammo.btTransform();
            form.setIdentity();
            form.setOrigin(pos);
            const shpere = new Ammo.btSphereShape(r)
            const localInertia = new Ammo.btVector3(0, 0, 0);
            shpere.calculateLocalInertia(mass,localInertia);
            const spherebody = new Ammo.btRigidBody(
                new Ammo.btRigidBodyConstructionInfo(
                    mass, 
                    new Ammo.btDefaultMotionState(form), 
                    shpere, 
                    localInertia
                )
            );

            // Z軸に加速度(1)を追加
            spherebody.setLinearVelocity(new Ammo.btVector3(0,0,1));
            // 反発係数を設定
            spherebody.setRestitution(0.6);
            // 摩擦係数を設定
            spherebody.setFriction(0.1);
            // 減衰率を設定
            spherebody.setDamping(0, 0.05);
            // 回転制限（1の軸でしか回転しない）
            spherebody.setAngularFactor(new Ammo.btVector3(1, 1, 1));
            // 滑り制限（1の軸でしか動かない。初期値には適用されない）
            spherebody.setLinearFactor(new Ammo.btVector3(1, 1, 1 ));
            // ワールドに設定
            world.ammo.addRigidBody(spherebody);
            return spherebody;
        }

        // 3Dエンジンの球設定
        function make_sphere_three() {
            // 球のポリゴンの頂点情報を指定。半径rで、緯度経度の分割数を指定する。（数字が大きいほど細かくなる）
            const sphereGeometry = new THREE.SphereGeometry( r, 16,16);
            // 表面の材質の指定。ここではランバート反射。色は赤色とする
            const sphereMaterial = new THREE.MeshLambertMaterial( { color: 0xff0000,
                // ワイヤーフレームにする。フレームの線の太さが指定できる
                wireframe: true,
                wireframeLinewidth: 0.2 
            });
            // 球オブジェクトを作成
            const sphereMesh = new THREE.Mesh( sphereGeometry, sphereMaterial );
            // 初期位置を指定
            sphereMesh.position.set(pos.x(), pos.y(), pos.z() );
            // 球をシーンに追加
            world.three_scene.add( sphereMesh );
            // 球を返す
            return sphereMesh;
        }
    }

    // 画面に描画する
    function rendering() {
        // 描画の際はシーンとカメラを指定する
        world.three_renderer.render( world.three_scene, world.three_camera );
    }

    // アニメーションを行う
    function animate(){
        // カウント回数分以下の処理を行う
        if (count >= 0) {
            // 物理演算及び画面描画を行う
            update();
            count--;
            // requestAnimationFrameは、ブラウザ任せで次に呼び出す関数を登録
            // 参考：http://lealog.hateblo.jp/entry/2013/10/01/235736
            window.requestAnimationFrame( animate );
        }
    }

    //  物理演算及び画面描画
    function update() {
        // 1/60間隔で物理演算
        world.ammo.stepSimulation(1/60, 0);
        // 球の位置情報を取得
        sphere.ammo.getMotionState().getWorldTransform(update_trans);
        // 3Dエンジン側の球に位置をセット
        sphere.three.position.set(
            update_trans.getOrigin().x(),
            update_trans.getOrigin().y(),
            update_trans.getOrigin().z()
        );
        // 3Dエンジン側の球の転がり具合をセット
        sphere.three.quaternion.set(
            update_trans.getRotation().x(),
            update_trans.getRotation().y(),
            update_trans.getRotation().z(),
            update_trans.getRotation().w()
        );


        // コンソール上に座標を表示
        console.log(" count:" + count + " sphere pos = " + 
            [update_trans.getOrigin().x().toFixed(2), 
             update_trans.getOrigin().y().toFixed(2), 
             update_trans.getOrigin().z().toFixed(2)]
        );

        // 画面描画
        rendering();
    }

    // 初期化
    const world = init(
        window.innerWidth, // WEBブラウザタブ内の幅を指定
        window.innerHeight, // WEBブラウザタブ内の高さを指定
        35, // 画角（広角気味)
        1, // ニアクリップ
        1000, // ファークリップ
        {x:20, y:20, z:20}, // カメラ位置
        {x:5, y:1, z:2} // ライト向き
    );

    // 地面設定
    const ground = make_ground(
        new Ammo.btVector3(5,0.5,5), // 地面サイズ
        new Ammo.btVector3(0, -0.5, 0) // 地面位置（高さをY=0地点にしたいので-0.5）
    );

    // 球設定
    const sphere = make_sphere(
        1, // 球半径
        1, // 球質量
        new Ammo.btVector3(0, 15, 0) // 球位置（地面に対して15垂直に離れている）
    );

    // 初期設定値でまず1回描画
    rendering();

    // 600回分アニメーションさせる
    const count = 600;
    // ループ内で毎回newするとメモリ使うので
    const update_trans = new Ammo.btTransform();
    // アニメーション開始
    animate();
}, false);

@@Đây là dự án làm app mobile quản lý bán nước do Lâm và Phi thực hiện.
@Phần mềm sử dụng công nghệ NodeJS EXPRESSJS MYSQL để làm back-end và sử dụng react-navtive để thực hiện làm front-end
dự án được chia thành 2 folder riêng.
@đổi các tên, ip căn bản trong file .env 







<!-- cai moi truong cua react-native -->
npx create-expo-app@latest my-app --template blank-typescript
<!-- reload lại file .env -->
npx expo start --clear

#chạy be thì cd vào be/src sau đó soạn lệnh npm i dotenv, npm i nodemon, sau đó  soạn npm run start để chạy backend.

#chạy fe thì cd vào fe-native/my-app 
vào cmd ghi ipconfig lấy ra ip của máy đang chạy backend ở dòng ip v4 và viết vào .env của fe,soạn lệnh npm i expo, sau đó chạy dòng npx expo start để build lại môi trường env cho fe, xem các module ở bên trong package.json để build cho đủ.


#đầu tiên là git clone https://github.com/user/abc.git


#git push( up lên)
git add .
git commit -m ""
git push origin main

#git pull( lấy về)
git pull origin main
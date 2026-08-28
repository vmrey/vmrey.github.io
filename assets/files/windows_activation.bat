@echo off
echo 正在安装产品密钥...
slmgr /ipk W269N-WFGWX-YVC9B-4J6C9-T83GX

echo 正在设置 KMS 服务器...
slmgr /skms kms.03k.org

echo 正在激活 Windows...
slmgr /ato

echo 执行完毕！
pause
exit
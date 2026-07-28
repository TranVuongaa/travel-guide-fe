# Hướng dẫn deploy Next.js lên EC2 (Amazon Linux) bằng Docker + GitHub Actions

## 1. Chuẩn bị source Next.js
Trong `next.config.js`, thêm dòng:
```js
module.exports = {
  output: 'standalone',
}
```
Dockerfile trong repo yêu cầu bắt buộc phải có dòng này để build đúng.

## 2. Cài Docker trên EC2 (Amazon Linux 2023 / 2)
SSH vào EC2 rồi chạy:
```bash
sudo yum update -y
sudo yum install -y docker
sudo systemctl enable --now docker
sudo usermod -aG docker ec2-user
# logout rồi login lại để áp dụng quyền group

# Cài docker compose plugin
sudo mkdir -p /usr/libexec/docker/cli-plugins
sudo curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 \
  -o /usr/libexec/docker/cli-plugins/docker-compose
sudo chmod +x /usr/libexec/docker/cli-plugins/docker-compose
```

Tạo thư mục chứa app + file compose + env:
```bash
mkdir -p ~/app && cd ~/app
# copy docker-compose.yml lên đây (scp hoặc tạo tay)
# tạo file .env chứa các biến môi trường cần cho app (DATABASE_URL, v.v.)
```

Mở port 3000 (hoặc dùng Nginx reverse proxy port 80/443) trong Security Group của EC2.

## 3. Cấu hình GitHub Secrets (Settings → Secrets and variables → Actions)
| Secret | Giá trị |
|---|---|
| `EC2_HOST` | IP hoặc domain của EC2 |
| `EC2_USER` | `ec2-user` |
| `EC2_SSH_KEY` | Nội dung private key (.pem) dùng để SSH vào EC2 |
| `GHCR_TOKEN` | Personal Access Token có quyền `read:packages` để pull image từ ghcr.io trên EC2 |

`GITHUB_TOKEN` để push image thì GitHub tự cấp sẵn, không cần tạo.

## 4. Luồng hoạt động của pipeline (`.github/workflows/deploy.yml`)
1. Push code lên nhánh `main`.
2. GitHub Actions build Docker image từ Dockerfile, push lên GitHub Container Registry (ghcr.io).
3. Actions SSH vào EC2, đăng nhập ghcr.io, `docker compose pull` + `docker compose up -d` để deploy bản mới, sau đó dọn image cũ.

## 5. (Tuỳ chọn) Dùng Nginx làm reverse proxy + SSL
Nếu muốn chạy domain thật với HTTPS, cài thêm Nginx trên EC2, proxy `443 → 127.0.0.1:3000`, dùng Certbot lấy chứng chỉ Let's Encrypt.

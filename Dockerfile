# 1. Aşama: Build & Publish
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Proje dosyalarını kopyala ve restore et
COPY ["RigForge.API/RigForge.API.csproj", "RigForge.API/"]
COPY ["RigForge.Core/RigForge.Core.csproj", "RigForge.Core/"]
COPY ["RigForge.Infrastructure/RigForge.Infrastructure.csproj", "RigForge.Infrastructure/"]

RUN dotnet restore "RigForge.API/RigForge.API.csproj"

# Tüm kaynak kodları kopyala ve derle
COPY . .
WORKDIR "/src/RigForge.API"
RUN dotnet build "RigForge.API.csproj" -c Release -o /app/build
RUN dotnet publish "RigForge.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# 2. Aşama: Runtime (Çalıştırma Ortamı)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Container içinde uygulamanın dinleyeceği port
ENV ASPNETCORE_URLS=http://+:5000
EXPOSE 5000

ENTRYPOINT ["dotnet", "RigForge.API.dll"]
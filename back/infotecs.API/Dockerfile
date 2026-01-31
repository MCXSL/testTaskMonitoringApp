FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

RUN apt-get update && \
    apt-get install -y libgssapi-krb5-2 libkrb5-3 && \
    rm -rf /var/lib/apt/lists/*

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY infotecs.sln ./

COPY infotecs.API/infotecs.API.csproj infotecs.API/
COPY infotecs.Application/infotecs.Application.csproj infotecs.Application/
COPY infotecs.DataAccess/infotecs.DataAccess.csproj infotecs.DataAccess/
COPY infotecs.Core/infotecs.Core.csproj infotecs.Core/


RUN dotnet restore

COPY . .

RUN dotnet build infotecs.API/infotecs.API.csproj -c Release -o /app/build


FROM build AS publish
RUN dotnet publish infotecs.API/infotecs.API.csproj -c Release -o /app/publish /p:UseAppHost=false


FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .



ENTRYPOINT ["dotnet", "infotecs.API.dll"]
FROM mcr.microsoft.com/dotnet/sdk:7.0 as build
# RUN dotnet tool install --global dotnet-ef
# ENV PATH="$PATH:/root/.dotnet/tools"
# ADD https.config .
# RUN openssl req -config https.config -new -out csr.pem
# RUN openssl x509 -req -days 365 -extfile https.config -extensions v3_req -in csr.pem -signkey key.pem -out https.crt
# RUN openssl pkcs12 -export -out https.pfx -inkey key.pem -in https.crt -password pass:!Pass123
WORKDIR /https
RUN dotnet dev-certs https -ep /https/aspnetapp.pfx -p Cert123
RUN dotnet dev-certs https --trust

FROM mcr.microsoft.com/dotnet/aspnet:7.0 as final
COPY --from=build / .
WORKDIR /publish



# ADD /publish/* .
# ENTRYPOINT ["dotnet", "OnlyPlans.dll"]
# RUN dotnet dev-certs https
# RUN dotnet dev-certs https --trust
#dotnet publish -c Release -o ../../Docker/api-server/publish
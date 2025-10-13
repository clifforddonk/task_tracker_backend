from rest_framework import serializers
from .models import User
from rest_framework.validators import ValidationError


class SignUpSerializer(serializers.ModelSerializer):
    email=serializers.CharField(max_length=45)
    username=serializers.CharField(max_length=45)
    password=serializers.CharField(max_length=12,write_only=True)

    class Meta:
        model=User
        fields=["email","username","password", 'role']

    def validate(self, attrs):
        email_exists=User.objects.filter(email=attrs["email"]).exists()

        if email_exists:
            raise ValidationError("Email has already been used")
        
        return super().validate(attrs) 

    def create(self,validated_data):
        password=validated_data.pop("password") 
        user=super().create(validated_data)
        user.set_password(password)
        user.save()
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'role']
        read_only_fields = ['id']   
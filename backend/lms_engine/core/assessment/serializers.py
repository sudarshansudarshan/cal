from rest_framework import serializers

from .models import Assessment, Question, QuestionOption

class AssessmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assessment
        fields = '__all__'

class QuestionOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionOption
        fields = '__all__'

class QuestionSerializer(serializers.ModelSerializer):
    options = serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields = '__all__'
    
    def get_options(self, obj):
        if obj.type in ['MCQ', 'MSQ']:
            return QuestionOptionSerializer(obj.options, many=True).data

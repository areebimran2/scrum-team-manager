from django.db import models
from django.utils import timezone
# Create your models here.
class Ticket(models.Model):
 
    tid = models.AutoField("Ticket Id", primary_key=True)
    title = models.CharField(max_length=100, default="New Ticket")
    description = models.CharField(max_length=500, default="No description")
    assigned = models.IntegerField(default=-1)
    story_points = models.IntegerField(default=0)
    creator = models.IntegerField()
    priority = models.IntegerField(default=0)
    date_created = models.DateTimeField(auto_now_add=True)
    completed = models.BooleanField(default=False)
    date_completed = models.DateTimeField()
    date_assigned = models.DateTimeField()
    project = models.IntegerField()

    def save(self, *args, **kwargs):
        if self.assigned != -1 and self.date_assigned is None:
            self.date_assigned = timezone.now()
        elif self.assigned == -1 and self.date_assigned is not None:
            self.date_assigned = None

        if self.completed and self.date_completed is None:
            self.date_completed = timezone.now()
        elif not self.completed and self.date_completed is not None:
            self.date_completed = None

        super(Ticket, self).save(*args, **kwargs)

from django.core.management.base import BaseCommand
from whitefly.models import Result
import copy

class Command(BaseCommand):
    help = 'Edit annotation coordinates in a Result object'

    def handle(self, *args, **options):
        result_id = 29  # Replace with the actual Result ID 

        #List of example new coordinate values that will be updated
        updates = [
            {"id": 11, "coordinates": {"xmin": 1155, "ymax": 900, "xmax": 700, "ymax": 900}},
            {"id": 14, "coordinates": {"xmin": 1480, "ymax": 500, "xmax": 1200, "ymax": 600}}, 
        ]

        #Obtain the coordinates at the given result id.
        try: 
            result = Result.objects.get(id=result_id)
            annotated_coordinates = result.annotated_coordinates

            # Find the index of the annotation with the specified ID
            for update_data in updates:
                annotation_id = update_data['id']  # Extract annotation ID.

               # Find the matching annotation
                annotation_index = next(
                    (index for index, annotation in enumerate(annotated_coordinates) if str(annotation_id) in annotation),
                    None
                )
   

                if annotation_index is not None:
                    # Create a copy of the existing annotation
                    previous_annotation = copy.deepcopy(annotated_coordinates[annotation_index])
                    print("previous annotation")
                    print(previous_annotation)
                        # Update the coordinates of the annotation with the new values
                    annotated_coordinates[annotation_index][str(annotation_id)].update(update_data['coordinates'])
                    print("previous annotation should remain the same after updating with new coordinates")
                    print(previous_annotation)

                    # Append the previous annotations to the new annotated_coordinates
                    annotated_coordinates.append(previous_annotation)  

                    # Save the Result object with the updated annotated_coordinates
                    result.annotated_coordinates = annotated_coordinates
                    result.save() 


                    self.stdout.write(self.style.SUCCESS(f'Annotation with ID {annotation_id} edited successfully in Result ID {result_id}.'))
                else:
                    self.stdout.write(self.style.WARNING(f'Annotation with ID {annotation_id} not found in Result ID {result_id}.'))
        except Result.DoesNotExist:
            self.stdout.write(self.style.ERROR(f'Result with ID {result_id} does not exist.'))



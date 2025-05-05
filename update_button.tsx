// Replace the new outline button
<div className="flex items-center mb-4">
  <h2 className="text-xl font-bold mr-2">Outlines</h2>
  <Button
    variant="outline"
    size="icon"
    className="h-6 w-6 rounded-full p-0"
    onClick={() => {
      setSelectedOutline(null);
      // Switch to the outlines tab to create a new outline
      const outlineTab = document.querySelector('[value="outlines"]') as HTMLElement;
      if (outlineTab) outlineTab.click();
    }}
  >
    <Plus className="h-3 w-3" />
  </Button>
</div>

// Update manuscript editor header
<div className="flex justify-between mb-4">
  <h2 className="text-xl font-bold">
    {manuscript && manuscript.id ? "Edit Manuscript" : "Add New Manuscript"}
  </h2>
  <div className="flex space-x-2">
    {manuscript && manuscript.id && (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            variant="outline" 
            className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this manuscript?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The manuscript will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                deleteManuscriptMutation.mutate(manuscript.id);
                queryClient.invalidateQueries({ queryKey: ["/api/manuscripts"] });
              }}
              className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )}
  </div>
</div>
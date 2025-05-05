// Manuscripts Tab
<TabsContent value="manuscripts">
  <div className="grid grid-cols-1 gap-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-1">
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
        {outlines && outlines.length > 0 ? (
          <div className="space-y-4">
            {outlines.map((outline: Outline) => (
              <Card key={outline.id} className={`relative cursor-pointer ${selectedOutline === outline.id ? 'border-primary' : ''}`}>
                <div className="flex" onClick={() => setSelectedOutline(outline.id)}>
                  <CardHeader className="flex-1">
                    <CardTitle className="text-sm">{outline.title}</CardTitle>
                    <CardDescription className="text-xs">
                      {outline.startChapter}:{outline.startVerse} - {outline.endChapter}:{outline.endVerse}
                    </CardDescription>
                  </CardHeader>
                  <div className="p-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-400 hover:text-red-500 h-6 w-6"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure you want to delete this outline?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. The outline will be permanently deleted.
                            Any associated manuscripts or commentaries might become orphaned.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteOutlineMutation.mutate(outline.id);
                            }}
                            className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center my-8">
            <p className="mb-4">No outlines found for this chapter.</p>
            <Button 
              onClick={() => {
                setSelectedOutline(null);
                // Switch to the outlines tab to create a new outline
                const outlineTab = document.querySelector('[value="outlines"]') as HTMLElement;
                if (outlineTab) outlineTab.click();
              }}
            >
              <Plus className="h-4 w-4 mr-1" />
              Create First Outline
            </Button>
          </div>
        )}
      </div>
      
      <div className="md:col-span-3">
        {selectedOutline ? (
          <div className="space-y-4">
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
            <ManuscriptEditor 
              outlineId={selectedOutline} 
              onSave={(manuscript) => saveManuscriptMutation.mutate(manuscript)}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <p className="mb-4 text-lg text-center">Select an outline to edit or create a manuscript</p>
            <p className="text-sm text-muted-foreground mb-6 text-center">
              Manuscripts are always connected to an outline. To create a new manuscript with a different verse range,
              first create a new outline.
            </p>
            <Button 
              onClick={() => {
                setSelectedOutline(null);
                // Switch to the outlines tab to create a new outline
                const outlineTab = document.querySelector('[value="outlines"]') as HTMLElement;
                if (outlineTab) outlineTab.click();
              }}
            >
              <Plus className="h-4 w-4 mr-1" />
              Create New Outline
            </Button>
          </div>
        )}
      </div>
    </div>
  </div>
</TabsContent>

// Commentaries Tab
<TabsContent value="commentaries">
  <div className="grid grid-cols-1 gap-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-1">
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
        {outlines && outlines.length > 0 ? (
          <div className="space-y-4">
            {outlines.map((outline: Outline) => (
              <Card key={outline.id} className={`relative cursor-pointer ${selectedOutline === outline.id ? 'border-primary' : ''}`}>
                <div className="cursor-pointer" onClick={() => setSelectedOutline(outline.id)}>
                  <CardHeader>
                    <CardTitle className="text-sm">{outline.title}</CardTitle>
                    <CardDescription className="text-xs">
                      {outline.startChapter}:{outline.startVerse} - {outline.endChapter}:{outline.endVerse}
                    </CardDescription>
                  </CardHeader>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center my-8">
            <p className="mb-4">No outlines found for this chapter.</p>
            <Button 
              onClick={() => {
                setSelectedOutline(null);
                // Switch to the outlines tab to create a new outline
                const outlineTab = document.querySelector('[value="outlines"]') as HTMLElement;
                if (outlineTab) outlineTab.click();
              }}
            >
              <Plus className="h-4 w-4 mr-1" />
              Create First Outline
            </Button>
          </div>
        )}
      </div>
      
      <div className="md:col-span-3">
        {selectedOutline ? (
          <div className="space-y-4">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">Commentaries</h2>
            </div>
            <CommentaryEditor 
              bookId={selectedBook} 
              chapter={selectedChapter}
              outlineId={selectedOutline}
              onSave={(commentary) => saveCommentaryMutation.mutate(commentary)}
              onDelete={(id) => deleteCommentaryMutation.mutate(id)}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <p className="mb-4 text-lg text-center">Select an outline to edit or create commentaries</p>
            <p className="text-sm text-muted-foreground mb-6 text-center">
              Commentaries are always connected to an outline. To create a new commentary with a different verse range,
              first create a new outline.
            </p>
            <Button 
              onClick={() => {
                setSelectedOutline(null);
                // Switch to the outlines tab to create a new outline
                const outlineTab = document.querySelector('[value="outlines"]') as HTMLElement;
                if (outlineTab) outlineTab.click();
              }}
            >
              <Plus className="h-4 w-4 mr-1" />
              Create New Outline
            </Button>
          </div>
        )}
      </div>
    </div>
  </div>
</TabsContent>
<?php

namespace App\Orchid\Screens;

use Orchid\Screen\Screen;

use App\Models\D3Model;
use Illuminate\Http\Request;
use Illuminate\Mail\Message;
use Illuminate\Support\Facades\Mail;
use Orchid\Screen\Fields\Input;
use Orchid\Screen\Fields\Quill;
use Orchid\Screen\Fields\TextArea;
use Orchid\Screen\Fields\Relation;
use Orchid\Support\Facades\Layout;
use Orchid\Screen\Actions\Button;
use Orchid\Support\Facades\Alert;



class D3ModelEditScreen extends Screen
{
    /**
     * @var D3Model
     */
    public $d3model;

    /**
     * Query data.
     *
     * @param D3Model $d3model
     *
     * @return array
     */
    public function query(D3Model $d3model): array
    {
        return [
            'd3model' => $d3model
        ];
    }


    /**
     * Display header name.
     *
     * @return string|null
     */
    public function name(): ?string
    {
        return $this->d3model->exists ? 'Edit D3Model' : 'Creating a new d3Model';
    }

    /**
     * The description is displayed on the user's screen under the heading
     */
    public function description(): ?string
    {
        return "D3 Models";
    }


    /**
     * Button commands.
     *
     * @return \Orchid\Screen\Action[]
     */
    public function commandBar(): iterable
    {
        return [
            Button::make('Create d3model')
                ->icon('pencil')
                ->method('createOrUpdate')
                ->canSee(!$this->d3model->exists),

            Button::make('Update')
                ->icon('note')
                ->method('createOrUpdate')
                ->canSee($this->d3model->exists),

            Button::make('Remove')
                ->icon('trash')
                ->method('remove')
                ->canSee($this->d3model->exists),
        ];
    }

    /**
     * @param D3Model    $post
     * @param Request $request
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function createOrUpdate(D3Model $d3model, Request $request)
    {
        $d3model->fill($request->get('d3model'))->save();

        Alert::info('You have successfully created a d3model.');

        return redirect()->route('platform.d3model.list');
    }

    /**
     * @param D3Model $post
     *
     * @return \Illuminate\Http\RedirectResponse
     * @throws \Exception
     */
    public function remove(D3Model $d3model)
    {
        $d3model->delete();

        Alert::info('You have successfully deleted the model.');

        return redirect()->route('platform.d3model.list');
    }

    /**
     * Views.
     *
     * @return Layout[]
     */
    public function layout(): array
    {
        return [
            Layout::rows([
                Input::make('d3model.name')
                    ->title('Name')
                    ->placeholder('Attractive but mysterious name')
                    ->help('Specify a short descriptive title for this model.'),

                Input::make('d3model.html')
                    ->title('Model Html')
                    ->placeholder('Model html or path'),

                TextArea::make('d3model.description')
                    ->title('Description')
                    ->rows(3)
                    ->maxlength(200)
                    ->placeholder('Brief description for preview'),

            ])
        ];
    }
}
